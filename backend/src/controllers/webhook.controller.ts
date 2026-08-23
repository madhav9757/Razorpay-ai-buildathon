import type { Request, Response } from 'express';
import { evaluateRecoveryEligibility } from '../services/risk/risk.engine.js';
import { evaluateRecoveryAction } from '../services/ai/ai.service.js';
import { createRecoveryLink } from '../services/razorpay/payment-links.service.js';
import { metricsService } from '../services/recovery/metrics.service.js';
import type { Payment } from '../types/payment.js';

export const handleRazorpayWebhook = async (req: Request, res: Response) => {
  res.status(200).send('OK');

  try {
    const payload = req.body;
    
    if (payload.event === 'payment.failed' && payload.payload?.payment?.entity) {
      const paymentEntity = payload.payload.payment.entity;
      
      const payment: Payment = {
        paymentId: paymentEntity.id,
        orderId: paymentEntity.order_id || null,
        amount: paymentEntity.amount / 100,
        currency: paymentEntity.currency,
        status: paymentEntity.status,
        method: paymentEntity.method,
        captured: paymentEntity.captured,
        customer: {
          email: paymentEntity.email || null,
          contact: paymentEntity.contact || null,
        },
        failure: {
          code: paymentEntity.error_code || null,
          reason: paymentEntity.error_reason || null,
        },
        createdAt: new Date(paymentEntity.created_at * 1000),
      };

      metricsService.addEvent({ event: 'payment.failed', paymentId: payment.paymentId });

      const decision = evaluateRecoveryEligibility(payment);
      console.log(`\n[Risk Engine] Payment ${payment.paymentId} eligibility:`, decision);
      
      if (decision.eligible) {
        const attempts = metricsService.getAttempts(payment.paymentId);
        
        // 1. POLICY GUARDRAIL (Deterministic Stop)
        if (attempts >= 2) {
          console.log(`[Policy Guardrail] Payment ${payment.paymentId} reached max recovery attempts (2). Halting.`);
          metricsService.addLog({
            paymentId: payment.paymentId,
            amount: payment.amount,
            failureReason: payment.failure.reason || 'unknown',
            aiDiagnosis: 'Max attempts reached',
            action: 'HALT',
            policyStatus: 'DENIED',
            recoveryStatus: 'STOPPED'
          });
          return;
        }

        metricsService.logRisk(payment.amount);
        console.log(`[AI Service] Evaluating payment ${payment.paymentId}...`);
        
        const aiDecision = await evaluateRecoveryAction({
          amount: payment.amount,
          reason: payment.failure.reason || 'unknown',
          ...(payment.failure.code ? { error_code: payment.failure.code } : {}),
          retry_count: attempts
        });
        
        console.log(`[AI Service] Action: ${aiDecision.action} | Confidence: ${aiDecision.confidence_score * 100}%`);
        console.log(`[AI Service] Channel: ${aiDecision.recommended_channel} | Hook: "${aiDecision.customer_communication_hook}"`);
        console.log(`[AI Service] Reasoning: ${aiDecision.reasoning}`);

        // 3. ENRICHED AUDIT LOG (Saving AI metadata)
        metricsService.addLog({
          paymentId: payment.paymentId,
          amount: payment.amount,
          failureReason: payment.failure.reason || 'unknown',
          // We combine the reasoning and channel for the frontend table
          aiDiagnosis: `${aiDecision.reasoning} (Rec: ${aiDecision.recommended_channel})`,
          action: aiDecision.action,
          policyStatus: 'APPROVED',
          recoveryStatus: 'PENDING'
        });

        if (aiDecision.action === 'PAYMENT_LINK' || aiDecision.action === 'RETRY') {
           metricsService.logAttempt(payment.paymentId);
        }

        // 4. EXECUTION BRANCHES
        if (aiDecision.action === 'PAYMENT_LINK') {
          console.log(`[Execution] Generating Payment Link for ${payment.paymentId}...`);
          try {
            const shortUrl = await createRecoveryLink({
              amountInPaise: paymentEntity.amount,
              description: `Recovery payment for failed transaction ${payment.paymentId}`,
              paymentId: payment.paymentId,
              customer: payment.customer.email ? {
                email: payment.customer.email,
                contact: payment.customer.contact
              } : undefined
            });
            console.log(`[Execution] Success! Recovery Link generated: ${shortUrl}`);
            metricsService.updateLogStatus(payment.paymentId, { paymentLinkUrl: shortUrl });
          } catch (e: any) {
            console.error(`[Execution] Failed to generate link for ${payment.paymentId}:`, e.message);
            metricsService.updateLogStatus(payment.paymentId, { recoveryStatus: 'STOPPED' });
          }
        } else if (aiDecision.action === 'RETRY') {
           console.log(`[Execution] Scheduling silent automatic retry for ${payment.paymentId}...`);
        } else if (aiDecision.action === 'ESCALATE') {
           console.log(`[Execution] Escalating ${payment.paymentId} to human support queue...`);
           metricsService.updateLogStatus(payment.paymentId, { recoveryStatus: 'STOPPED' });
        } else if (aiDecision.action === 'HALT') {
           console.log(`[Execution] AI determined payment ${payment.paymentId} should be halted.`);
           metricsService.updateLogStatus(payment.paymentId, { recoveryStatus: 'STOPPED' });
        }
      } else {
        metricsService.addLog({
          paymentId: payment.paymentId,
          amount: payment.amount,
          failureReason: payment.failure.reason || 'unknown',
          aiDiagnosis: 'Risk Engine rejected',
          action: 'IGNORED' as any,
          policyStatus: 'DENIED',
          recoveryStatus: 'IGNORED' as any
        });
      }
    } else if (payload.event === 'payment_link.paid' && payload.payload?.payment_link?.entity) {
      const paymentLinkEntity = payload.payload.payment_link.entity;
      const amountPaidINR = paymentLinkEntity.amount_paid / 100;
      const originalPaymentId = paymentLinkEntity.notes?.original_payment_id;

      if (originalPaymentId) {
        metricsService.addEvent({ event: 'payment_link.paid', paymentId: originalPaymentId });
        metricsService.logRecoverySuccess(amountPaidINR);
        metricsService.updateLogStatus(originalPaymentId, { recoveryStatus: 'RECOVERED' });
        console.log(`\n[Recovery Verified] 💰 Successfully recovered ₹${amountPaidINR} from original payment ${originalPaymentId}!`);
      }
    }
  } catch (error) {
    console.error('[Webhook] Error processing payload:', error);
  }
};