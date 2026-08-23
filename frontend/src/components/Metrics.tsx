import type { RecoveryMetrics } from "../hooks/useRecoveryData";

export function Metrics({ metrics }: { metrics: RecoveryMetrics }) {
  const formatCurrency = (amount: number) =>
    `₹${amount.toLocaleString("en-IN")}`;

  const recoveryRate = (metrics.recoveryRate || 0).toFixed(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="p-4 bg-zinc-950 border border-zinc-800 rounded flex flex-col justify-center">
        <h2 className="text-xs uppercase tracking-wider font-semibold text-zinc-500 mb-1">
          Revenue At Risk
        </h2>
        <div className="text-2xl font-bold text-zinc-100">
          {formatCurrency(metrics.totalRevenueAtRisk)}
        </div>
      </div>
      
      <div className="p-4 bg-zinc-950 border border-zinc-800 rounded flex flex-col justify-center">
        <h2 className="text-xs uppercase tracking-wider font-semibold text-zinc-500 mb-1">
          Revenue Recovered
        </h2>
        <div className="text-2xl font-bold text-zinc-100">
          {formatCurrency(metrics.totalRevenueRecovered)}
        </div>
      </div>
      
      <div className="p-4 bg-zinc-950 border border-zinc-800 rounded flex flex-col justify-center">
        <h2 className="text-xs uppercase tracking-wider font-semibold text-zinc-500 mb-1">
          Recovery Rate
        </h2>
        <div className="text-2xl font-bold text-zinc-100">
          {recoveryRate}%
        </div>
      </div>
      
      <div className="p-4 bg-zinc-950 border border-zinc-800 rounded flex flex-col justify-center">
        <h2 className="text-xs uppercase tracking-wider font-semibold text-zinc-500 mb-1">
          Active Interventions
        </h2>
        <div className="text-2xl font-bold text-zinc-100">
          {metrics.totalAttempts}
        </div>
      </div>
    </div>
  );
}
