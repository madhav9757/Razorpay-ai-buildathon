import type { Payment } from "../../types/payment.js";
import { velocityGuard } from "./velocity.guard.js";

const RECOVERABLE_REASONS = [
  "insufficient_balance",
  "payment_timed_out",
  "authentication_failed",
  "customer_cancelled",
];

// Historical success probabilities based on Razorpay failure categories
const HISTORICAL_SUCCESS_RATES: Record<string, number> = {
  payment_timed_out: 0.85,
  insufficient_balance: 0.40,
  authentication_failed: 0.60,
  customer_cancelled: 0.30,
  DEFAULT: 0.50,
};

export interface RiskDecision {
  eligible: boolean;
  reason: string;
  evrMetrics?: {
    expectedValue: number;
    operationalCost: number;
  };
}

export function calculateExpectedValue(
  amount: number,
  confidenceScore: number = 0.8,
  reason?: string,
): { evrScore: number; isViable: boolean } {
  const V = amount;
  const Pc = confidenceScore;

  // Safely resolve historical rate with explicit type narrowing
  let Hr = HISTORICAL_SUCCESS_RATES["DEFAULT"] ?? 0.5;

  if (reason && reason in HISTORICAL_SUCCESS_RATES) {
    const matchedRate = HISTORICAL_SUCCESS_RATES[reason];
    if (matchedRate !== undefined) {
      Hr = matchedRate;
    }
  }

  const C_ops = 2.5; // Fixed operational overhead in INR

  const evrScore = V * Pc * Hr - C_ops;

  return {
    evrScore: Number(evrScore.toFixed(2)),
    isViable: evrScore > 0,
  };
}

export function evaluateRecoveryEligibility(payment: Payment): RiskDecision {
  const identifier =
    payment.customer?.email || payment.customer?.contact || payment.paymentId;
  const velocityCheck = velocityGuard.checkVelocity(identifier);

  if (!velocityCheck.allowed) {
    return { eligible: false, reason: "Velocity limit exceeded" };
  }

  if (payment.amount <= 500) {
    return {
      eligible: false,
      reason: `Amount (₹${payment.amount}) is below the ₹500 threshold for recovery`,
    };
  }

  const errorReason = payment.failure?.reason;
  if (!errorReason) {
    return {
      eligible: false,
      reason: "No explicit failure reason provided",
    };
  }

  if (!RECOVERABLE_REASONS.includes(errorReason)) {
    return {
      eligible: false,
      reason: `Non-recoverable failure reason: ${errorReason}`,
    };
  }

  // Apply Mathematical EVR Pre-Check (assuming a standard 0.75 baseline confidence prior to multi-agent deep scan)
  const evrCheck = calculateExpectedValue(payment.amount, 0.75, errorReason);

  if (!evrCheck.isViable) {
    return {
      eligible: false,
      reason: `Mathematical EVR failure: Expected value (₹${evrCheck.evrScore}) is negative after operational costs`,
      evrMetrics: { expectedValue: evrCheck.evrScore, operationalCost: 2.5 },
    };
  }

  return {
    eligible: true,
    reason: `Eligible for recovery. Reason: ${errorReason} [EVR: ₹${evrCheck.evrScore}]`,
    evrMetrics: { expectedValue: evrCheck.evrScore, operationalCost: 2.5 },
  };
}