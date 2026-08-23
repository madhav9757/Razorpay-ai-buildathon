import fetch from 'node-fetch';

export type RecoveryAction = 'PAYMENT_LINK' | 'RETRY' | 'ESCALATE' | 'HALT';

export interface AIDecision {
  action: RecoveryAction;
  root_cause_category: 'CUSTOMER_FUNDS' | 'NETWORK_OUTAGE' | 'USER_DROP' | 'SECURITY_RISK' | 'POLICY_VIOLATION' | 'UNKNOWN';
  confidence_score: number;
  recovery_probability: number;
  recommended_channel: 'WHATSAPP_UPI' | 'EMAIL' | 'SILENT_BACKGROUND' | 'MANUAL_SUPPORT' | 'NONE';
  reasoning: string;
  customer_communication_hook: string;
}

export async function evaluateRecoveryAction(paymentContext: { 
  amount: number; 
  reason: string; 
  error_code?: string; 
  error_description?: string;
  retry_count?: number;
}): Promise<AIDecision> {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENROUTER_API_KEY 
    ? 'https://openrouter.ai/api/v1/chat/completions'
    : 'https://api.openai.com/v1/chat/completions';
    
  if (!apiKey) {
    console.warn('[AI Service] No API key found. Falling back to deterministic mapping.');
    return {
      action: paymentContext.reason === 'insufficient_balance' ? 'PAYMENT_LINK' : 'RETRY',
      root_cause_category: 'CUSTOMER_FUNDS',
      confidence_score: 0.8,
      recovery_probability: 0.7,
      recommended_channel: 'WHATSAPP_UPI',
      reasoning: 'Fallback due to missing API key',
      customer_communication_hook: 'Complete your transaction with a single tap using your preferred UPI app.'
    };
  }

  const prompt = `
You are an Autonomous AI Financial Recovery Engine operating inside Razorpay's payment infrastructure.
Analyze the failed payment and output a recovery strategy.

Context:
- Amount: ₹${paymentContext.amount}
- Failure Reason: ${paymentContext.reason}
- Error Code: ${paymentContext.error_code || 'N/A'}
- Prior Retries: ${paymentContext.retry_count || 0}

OPERATIONAL POLICIES:
1. 'insufficient_balance': Card/account lacks funds. Action: PAYMENT_LINK. Channel: WHATSAPP_UPI.
2. 'payment_timed_out' | 'gateway_error': Network glitch. Action: RETRY. Channel: SILENT_BACKGROUND.
3. 'authentication_failed' | 'customer_cancelled': User abandoned 3DS/OTP. Action: PAYMENT_LINK. Channel: EMAIL/WHATSAPP_UPI.
4. 'fraud_suspected' | 'card_disabled': Permanent decline. Action: ESCALATE or HALT. Channel: MANUAL_SUPPORT or NONE.
5. Amount < ₹500: Below minimum threshold. Action: HALT.

Respond ONLY with valid JSON in this exact format:
{
  "action": "PAYMENT_LINK" | "RETRY" | "ESCALATE" | "HALT",
  "root_cause_category": "CUSTOMER_FUNDS" | "NETWORK_OUTAGE" | "USER_DROP" | "SECURITY_RISK" | "POLICY_VIOLATION",
  "confidence_score": <number between 0.0 and 1.0>,
  "recovery_probability": <number between 0.0 and 1.0>,
  "recommended_channel": "WHATSAPP_UPI" | "EMAIL" | "SILENT_BACKGROUND" | "MANUAL_SUPPORT" | "NONE",
  "reasoning": "<1-2 sentence concise diagnostic explanation>",
  "customer_communication_hook": "<Friendly 1-sentence copy to send customer, or empty if silent>"
}`.trim();

  // gpt-4o-mini is heavily optimized for strict JSON output
  const model = process.env.AI_MODEL || (process.env.OPENROUTER_API_KEY ? 'openai/gpt-4o-mini' : 'gpt-4o-mini');

  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'system', content: prompt }],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error(`AI API returned status ${response.status}`);
    }

    const data = await response.json() as any;
    const content = data.choices[0].message.content;
    const parsed = JSON.parse(content) as AIDecision;
    
    return parsed;
  } catch (error: any) {
    console.error('[AI Service] Error calling AI:', error.message);
    return {
      action: 'PAYMENT_LINK',
      root_cause_category: 'UNKNOWN',
      confidence_score: 0.5,
      recovery_probability: 0.5,
      recommended_channel: 'EMAIL',
      reasoning: 'Error calling AI model, defaulting to PAYMENT_LINK',
      customer_communication_hook: 'There was an issue with your payment. Please click here to try again.'
    };
  }
}