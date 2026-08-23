import fetch from 'node-fetch';

export type RecoveryAction = 'PAYMENT_LINK' | 'RETRY' | 'ESCALATE' | 'HALT';
export type CommunicationChannel = 'SMS' | 'WHATSAPP' | 'EMAIL' | 'SILENT';

export interface AIDecision {
  root_cause: string;
  confidence_score: number;
  action: RecoveryAction;
  reasoning: string;
  recommended_channel: CommunicationChannel;
  customer_communication_hook: string;
}

interface DiagnosticOutput {
  root_cause: string;
  confidence_score: number;
}

interface PolicyOutput {
  action: RecoveryAction;
  reasoning: string;
}

interface GenerativeOutput {
  recommended_channel: CommunicationChannel;
  customer_communication_hook: string;
}

async function callLLM(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENROUTER_API_KEY
    ? 'https://openrouter.ai/api/v1/chat/completions'
    : 'https://api.openai.com/v1/chat/completions';

  if (!apiKey) {
    throw new Error('No API key found.');
  }

  const model = process.env.AI_MODEL || (process.env.OPENROUTER_API_KEY ? 'openai/gpt-4o-mini' : 'gpt-4o-mini');

  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    throw new Error(`AI API returned status ${response.status}`);
  }

  const data = await response.json() as any;
  return data.choices[0].message.content;
}

async function runDiagnosticNode(amount: number, reason: string, error_code?: string): Promise<DiagnosticOutput> {
  const systemPrompt = "You are a financial diagnostic AI. Analyze the error and return JSON with root_cause (string) and confidence_score (number 0-1).";
  const userPrompt = `Amount: ${amount}\nReason: ${reason}\nError Code: ${error_code || 'N/A'}`;

  const content = await callLLM(systemPrompt, userPrompt);
  return JSON.parse(content) as DiagnosticOutput;
}

async function runPolicyNode(root_cause: string, confidence_score: number, retry_count: number): Promise<PolicyOutput> {
  const systemPrompt = "You are a risk management AI. Based on the diagnosis, decide the action. Return JSON with action (strictly 'PAYMENT_LINK' | 'RETRY' | 'ESCALATE' | 'HALT') and reasoning (1 sentence).";
  const userPrompt = `Root Cause: ${root_cause}\nConfidence Score: ${confidence_score}\nRetry Count: ${retry_count}`;

  const content = await callLLM(systemPrompt, userPrompt);
  return JSON.parse(content) as PolicyOutput;
}

async function runGenerativeNode(root_cause: string, action: RecoveryAction): Promise<GenerativeOutput> {
  const systemPrompt = "You are a customer success AI. Return JSON with recommended_channel ('SMS' | 'WHATSAPP' | 'EMAIL' | 'SILENT') and customer_communication_hook (A short, polite 1-sentence message). Only generate a hook if action is PAYMENT_LINK or RETRY.";
  const userPrompt = `Root Cause: ${root_cause}\nAction: ${action}`;

  const content = await callLLM(systemPrompt, userPrompt);
  return JSON.parse(content) as GenerativeOutput;
}

export const evaluateRecoveryAction = async (params: { amount: number; reason: string; error_code?: string; retry_count: number }): Promise<AIDecision> => {
  try {
    const diagnostic = await runDiagnosticNode(params.amount, params.reason, params.error_code);
    const policy = await runPolicyNode(diagnostic.root_cause, diagnostic.confidence_score, params.retry_count);
    const generative = await runGenerativeNode(diagnostic.root_cause, policy.action);

    return {
      root_cause: diagnostic.root_cause,
      confidence_score: diagnostic.confidence_score,
      action: policy.action,
      reasoning: policy.reasoning,
      recommended_channel: generative.recommended_channel,
      customer_communication_hook: generative.customer_communication_hook
    };
  } catch (error) {
    console.error('[AI Service] Orchestrator failed or JSON parsing error:', error);
    return {
      root_cause: 'UNKNOWN',
      confidence_score: 0,
      action: 'HALT',
      reasoning: 'Fallback due to orchestration failure or missing API key',
      recommended_channel: 'SILENT',
      customer_communication_hook: ''
    };
  }
};