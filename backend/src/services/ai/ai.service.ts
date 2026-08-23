import fetch from 'node-fetch';

export type RecoveryAction = 'PAYMENT_LINK' | 'RETRY' | 'ESCALATE';

export interface AIDecision {
  reasoning: string;
  action: RecoveryAction;
}

export async function evaluateRecoveryAction(paymentContext: { amount: number, reason: string }): Promise<AIDecision> {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENROUTER_API_KEY 
    ? 'https://openrouter.ai/api/v1/chat/completions'
    : 'https://api.openai.com/v1/chat/completions';
    
  if (!apiKey) {
    console.warn('[AI Service] No API key found. Falling back to deterministic mapping.');
    return {
      reasoning: 'Fallback due to missing API key',
      action: paymentContext.reason === 'insufficient_balance' ? 'PAYMENT_LINK' : 'RETRY'
    };
  }

  const prompt = `
You are an AI Revenue Recovery Agent. Analyze the following failed payment context and decide the best recovery action.
Context:
- Amount: ₹${paymentContext.amount}
- Failure Reason: ${paymentContext.reason}

Rules:
- If reason is "insufficient_balance", the action MUST be "PAYMENT_LINK".
- If reason is "payment_timed_out" or similar retryable network issues, the action MUST be "RETRY".
- For all other recoverable issues, decide between "PAYMENT_LINK" and "RETRY", or "ESCALATE" if human intervention is needed.

Respond ONLY with valid JSON in this exact format:
{
  "reasoning": "<string explaining why>",
  "action": "PAYMENT_LINK" | "RETRY" | "ESCALATE"
}
  `.trim();

  const model = process.env.AI_MODEL || (process.env.OPENROUTER_API_KEY ? 'openai/gpt-3.5-turbo' : 'gpt-3.5-turbo');

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
      reasoning: 'Error calling AI model, defaulting to PAYMENT_LINK',
      action: 'PAYMENT_LINK'
    };
  }
}
