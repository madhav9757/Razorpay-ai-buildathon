import type { Request, Response } from 'express';
import fetch from 'node-fetch';

const REASONS = [
  'insufficient_balance',
  'payment_timed_out',
  'authentication_failed',
  'customer_cancelled',
  'card_disabled',
  'fraud_suspected'
];


const WEBHOOK_URL = 'http://localhost:3000/webhook/razorpay';

export const simulateBatch = (req: Request, res: Response) => {
  res.status(202).json({ message: 'Synthetic batch simulation started' });

  setTimeout(async () => {
    console.log('[Simulation] Starting synthetic webhook injection...');

    const recoverablePayments: { id: string, amount: number }[] = [];

    const failuresCount = Math.floor(Math.random() * 6) + 5;

    for (let i = 0; i < failuresCount; i++) {
      const amountInINR = Math.floor(Math.random() * 1900) + 100;
      const amountInPaise = amountInINR * 100;
      const randomReason = REASONS[Math.floor(Math.random() * REASONS.length)];
      const paymentId = `pay_${Math.random().toString(36).substring(2, 9)}`;

      if (randomReason !== 'card_disabled' && randomReason !== 'fraud_suspected' && amountInINR >= 500) {
        recoverablePayments.push({ id: paymentId, amount: amountInPaise });
      }

      const payload = {
        event: 'payment.failed',
        payload: {
          payment: {
            entity: {
              id: paymentId,
              amount: amountInPaise,
              currency: 'INR',
              status: 'failed',
              method: 'upi',
              order_id: `order_${Math.random().toString(36).substring(2, 9)}`,
              captured: false,
              email: 'test@example.com',
              contact: '+919876543210',
              error_code: 'BAD_REQUEST_ERROR',
              error_reason: randomReason,
              created_at: Math.floor(Date.now() / 1000)
            }
          }
        }
      };

      try {
        await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        console.log(`[Simulation] Injected failure (Amount: ₹${amountInINR}, Reason: ${randomReason})`);
      } catch (error: any) {
        console.error(`[Simulation] Failed to inject:`, error.message);
      }

      await new Promise(resolve => setTimeout(resolve, 300));
    }

    console.log('[Simulation] Waiting 3 seconds for AI recovery evaluations...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('[Simulation] Injecting successful recoveries...');
    const paymentsToRecover = recoverablePayments.slice(0, Math.ceil(recoverablePayments.length / 2));
    for (const p of paymentsToRecover) {
      const payload = {
        event: 'payment_link.paid',
        payload: {
          payment_link: {
            entity: {
              id: `plink_${Math.random().toString(36).substring(2, 9)}`,
              amount_paid: p.amount,
              notes: {
                original_payment_id: p.id
              }
            }
          }
        }
      };
      
      try {
        await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        console.log(`[Simulation] Injected recovery for ${p.id}`);
      } catch (error: any) {
        console.error(`[Simulation] Failed to send recovery payload:`, error.message);
      }
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    console.log('[Simulation] Synthetic injection complete!');
  }, 100);
};
