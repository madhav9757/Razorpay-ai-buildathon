import fetch from 'node-fetch'; // Requires node-fetch or native fetch in Node 18+

const REASONS = [
  'insufficient_balance',
  'payment_timed_out',
  'authentication_failed',
  'customer_cancelled',
  'card_disabled', // non-recoverable
  'fraud_suspected' // non-recoverable
];

const WEBHOOK_URL = 'http://localhost:3000/webhook/razorpay'; 

async function run() {
  console.log('Starting synthetic webhook injection...');

  const recoverablePayments: { id: string, amount: number }[] = [];

  for (let i = 0; i < 10; i++) {
    const amountInINR = Math.floor(Math.random() * 1900) + 100; // 100 to 2000 INR
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
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log(`[POST ${i+1}/10] Payload sent (Amount: ₹${amountInINR}, Reason: ${randomReason}) - Status: ${response.status}`);
    } catch (error: any) {
      console.error(`[POST ${i+1}/10] Failed to send payload:`, error.message);
    }

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log('Finished injecting failures. Waiting 5 seconds for recovery links to be generated...');
  await new Promise(resolve => setTimeout(resolve, 5000));

  console.log('Injecting successful recoveries...');
  const paymentsToRecover = recoverablePayments.slice(0, 3);
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
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      console.log(`[Recovery] Payload sent for original payment ${p.id} - Status: ${response.status}`);
    } catch (error: any) {
      console.error(`[Recovery] Failed to send payload:`, error.message);
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  console.log('Synthetic injection complete!');
}

run();
