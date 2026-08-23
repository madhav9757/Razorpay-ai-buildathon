import type { Payment } from '../../types/payment.js';
import { velocityGuard } from './velocity.guard.js';

const RECOVERABLE_REASONS = [
  'insufficient_balance',
  'payment_timed_out',
  'authentication_failed',
  'customer_cancelled'
];

export interface RiskDecision {
  eligible: boolean;
  reason: string;
}

export function evaluateRecoveryEligibility(payment: Payment): RiskDecision {
  const identifier = payment.customer?.email || payment.customer?.contact || payment.paymentId;
  const velocityCheck = velocityGuard.checkVelocity(identifier);

  if (!velocityCheck.allowed) {
    return { eligible: false, reason: 'Velocity limit exceeded' };
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
      reason: 'No explicit failure reason provided',
    };
  }

  if (RECOVERABLE_REASONS.includes(errorReason)) {
    return {
      eligible: true,
      reason: `Eligible for recovery. Reason: ${errorReason}`,
    };
  }

  return {
    eligible: false,
    reason: `Non-recoverable failure reason: ${errorReason}`,
  };
}
