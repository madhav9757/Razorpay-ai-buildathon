import type { RecoveryMetrics } from "../hooks/useRecoveryData";

export function Metrics({ metrics }: { metrics: RecoveryMetrics }) {
  const formatCurrency = (amount: number) =>
    `₹${amount.toLocaleString("en-IN")}`;

  const recoveryRate =
    metrics.total_revenue_at_risk > 0
      ? ((metrics.total_revenue_recovered / metrics.total_revenue_at_risk) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col justify-center">
        <h2 className="text-sm font-medium text-slate-500 mb-2">
          Revenue At Risk
        </h2>
        <div className="text-3xl font-bold text-slate-900">
          {formatCurrency(metrics.total_revenue_at_risk)}
        </div>
      </div>
      <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col justify-center">
        <h2 className="text-sm font-medium text-slate-500 mb-2">
          Revenue Recovered
        </h2>
        <div className="text-3xl font-bold text-emerald-600">
          {formatCurrency(metrics.total_revenue_recovered)}
        </div>
      </div>
      <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col justify-center">
        <h2 className="text-sm font-medium text-slate-500 mb-2">
          Recovery Rate
        </h2>
        <div className="text-3xl font-bold text-slate-900">
          {recoveryRate}%
        </div>
        <div className="mt-1 text-xs text-slate-400">
          Attempts: {metrics.total_recovery_attempts}
        </div>
      </div>
    </div>
  );
}
