import type { RecoveryMetrics } from "../hooks/useRecoveryData";

export function Metrics({ metrics }: { metrics: RecoveryMetrics }) {
  const formatCurrency = (amount: number) =>
    `₹${amount.toLocaleString("en-IN")}`;

  const recoveryRate = (metrics.recoveryRate || 0).toFixed(1);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="p-4 bg-white border-2 border-black flex flex-col justify-center">
        <h2 className="text-xs uppercase tracking-wider font-bold text-black mb-1 opacity-70">
          Revenue At Risk
        </h2>
        <div className="text-2xl font-bold text-black">
          {formatCurrency(metrics.totalRevenueAtRisk)}
        </div>
      </div>
      
      <div className="p-4 bg-white border-2 border-black flex flex-col justify-center">
        <h2 className="text-xs uppercase tracking-wider font-bold text-black mb-1 opacity-70">
          Revenue Recovered
        </h2>
        <div className="text-2xl font-bold text-black">
          {formatCurrency(metrics.totalRevenueRecovered)}
        </div>
      </div>
      
      <div className="p-4 bg-white border-2 border-black flex flex-col justify-center">
        <h2 className="text-xs uppercase tracking-wider font-bold text-black mb-1 opacity-70">
          Recovery Rate
        </h2>
        <div className="text-2xl font-bold text-black">
          {recoveryRate}%
        </div>
      </div>
      
      <div className="p-4 bg-white border-2 border-black flex flex-col justify-center">
        <h2 className="text-xs uppercase tracking-wider font-bold text-black mb-1 opacity-70">
          Active Interventions
        </h2>
        <div className="text-2xl font-bold text-black">
          {metrics.totalAttempts}
        </div>
      </div>
    </div>
  );
}
