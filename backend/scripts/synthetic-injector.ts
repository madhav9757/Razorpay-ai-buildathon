import fetch from 'node-fetch';

const WEBHOOK_URL = 'http://localhost:3000/webhook/razorpay'; 

const SYNTHETIC_BATCH = [
  // 1. Recoverable via Payment Link
  { id: 'pay_demo_bal_01', amount: 149900, reason: 'insufficient_balance', expectedAction: 'PAYMENT_LINK' },
  { id: 'pay_demo_bal_02', amount: 499900, reason: 'insufficient_balance', expectedAction: 'PAYMENT_LINK' },
  
  { id: 'pay_demo_time_01', amount: 249900, reason: 'payment_timed_out', expectedAction: 'RETRY' },
  { id: 'pay_demo_time_02', amount: 79900, reason: 'payment_timed_out', expectedAction: 'RETRY' },
  
  { id: 'pay_demo_fraud_01', amount: 1500000, reason: 'fraud_suspected', expectedAction: 'ESCALATE' },
  { id: 'pay_demo_card_01', amount: 320000, reason: 'card_disabled', expectedAction: 'ESCALATE' },
  
  { id: 'pay_demo_auth_01', amount: 189900, reason: 'authentication_failed', expectedAction: 'PAYMENT_LINK' },
  { id: 'pay_demo_cancel_01', amount: 849900, reason: 'customer_cancelled', expectedAction: 'PAYMENT_LINK' },

  { id: 'pay_demo_micro_01', amount: 35000, reason: 'insufficient_balance', expectedAction: 'HALT' }, // ₹350
  
  { id: 'pay_demo_bal_03', amount: 750000, reason: 'insufficient_balance', expectedAction: 'PAYMENT_LINK' },
];

async function run() {
  console.log('🚀 Starting Deterministic Synthetic Webhook Injection (10 Events)...');

  const recoverablePayments: { id: string, amount: number }[] = [];

  for (let i = 0; i < SYNTHETIC_BATCH.length; i++) {
    const event = SYNTHETIC_BATCH[i];
    
    // Track payments that the AI is expected to generate a link for
    if (event.expectedAction === 'PAYMENT_LINK') {
      recoverablePayments.push({ id: event.id, amount: event.amount });
    }

    const payload = {
      event: 'payment.failed',
      payload: {
        payment: {
          entity: {
            id: event.id,
            amount: event.amount,
            currency: 'INR',
            status: 'failed',
            method: 'upi',
            order_id: `order_demo_${Math.random().toString(36).substring(2, 9)}`,
            captured: false,
            email: 'judge@razorpay.com',
            contact: '+919876543210',
            error_code: 'BAD_REQUEST_ERROR',
            error_reason: event.reason,
            created_at: Math.floor(Date.now() / 1000)
          }
        }
      }
    };

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log(`[POST ${i+1}/10] Sent ID: ${event.id} | Reason: ${event.reason} | ₹${event.amount / 100} - Status: ${response.status}`);
    } catch (error: any) {
      console.error(`[POST ${i+1}/10] Failed to send payload:`, error.message);
    }

    await new Promise(resolve => setTimeout(resolve, 800));
  }

  console.log('\n⏳ Finished injecting failures. Waiting 5 seconds for AI to generate recovery links...');
  await new Promise(resolve => setTimeout(resolve, 5000));

  console.log('\n💰 Simulating successful recoveries from customers...');
  
  for (const p of recoverablePayments) {
    const payload = {
      event: 'payment_link.paid',
      payload: {
        payment_link: {
          entity: {
            id: `plink_${p.id.replace('pay_', '')}`,
            status: 'paid',
            amount_paid: p.amount,
            notes: {
              original_payment_id: p.id
            }
          }
        }
      }
    };
    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      console.log(`[Recovery Verified] Customer paid link for original payment ${p.id} - Status: ${response.status}`);
    } catch (error: any) {
      console.error(`[Recovery Failed] Failed to send payload for ${p.id}:`, error.message);
    }
    
    await new Promise(resolve => setTimeout(resolve, 600));
  }
  
  console.log('\n✅ Deterministic injection complete! Check your dashboard.');
}

run();