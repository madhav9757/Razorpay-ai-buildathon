import Razorpay from 'razorpay';

let razorpayInstance: Razorpay | null = null;

function getRazorpay(): Razorpay {
  if (!razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in the environment');
    }
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
}

export async function createRecoveryLink(paymentContext: { amountInPaise: number, description: string, customer?: any }): Promise<string> {
  const rzp = getRazorpay();
  
  try {
    const payload = {
      amount: paymentContext.amountInPaise,
      currency: "INR",
      accept_partial: false,
      description: paymentContext.description,
      customer: paymentContext.customer || {
        name: "Customer",
        email: "customer@example.com",
        contact: "+919000090000"
      },
      notify: {
        sms: true,
        email: true
      },
      reminder_enable: true
    };

    const paymentLink = await rzp.paymentLink.create(payload);
    return paymentLink.short_url;
  } catch (error) {
    console.error('[Payment Links] Failed to create recovery link:', error);
    throw error;
  }
}
