import type { RecoveryMetrics } from "../hooks/useRecoveryData";

export function Metrics({ metrics }: { metrics: RecoveryMetrics }) {
  const formatCurrency = (amount: number) =>
    `₹${amount.toLocaleString("en-IN")}`;
  const recoveryRate = (metrics.recoveryRate || 0).toFixed(1);

  const kpis = [
    {
      label: "Revenue At Risk",
      value: formatCurrency(metrics.totalRevenueAtRisk),
    },
    {
      label: "Revenue Recovered",
      value: formatCurrency(metrics.totalRevenueRecovered),
    },
    { label: "Recovery Rate", value: `${recoveryRate}%` },
    { label: "Interventions", value: metrics.totalAttempts },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 text-black">
      {kpis.map((kpi, idx) => (
        <div
          key={idx}
          className="p-4 sm:p-5 bg-white border-2 border-black flex flex-col justify-between min-h-25"
        >
          <h2 className="text-[10px] sm:text-xs font-black uppercase tracking-widest opacity-60 mb-2">
            {kpi.label}
          </h2>
          <div className="text-2xl sm:text-3xl font-black tracking-tighter">
            {kpi.value}
          </div>
        </div>
      ))}
    </div>
  );
}
