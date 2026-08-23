import type { AuditLogEntry } from "../hooks/useRecoveryData";
import { ExternalLink } from "lucide-react";

export function AuditLog({ logs }: { logs: AuditLogEntry[] }) {
  const formatAmount = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

  return (
    <div className="h-full flex flex-col bg-zinc-950">
      <div className="px-4 py-3 border-b border-zinc-800 flex justify-between items-center bg-zinc-950">
        <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">
          Live Audit Trail
        </h3>
        <span className="text-[10px] uppercase font-bold tracking-wider bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
          Live
        </span>
      </div>
      <div className="overflow-x-auto overflow-y-auto flex-1">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-zinc-900 text-zinc-400 border-b border-zinc-800 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2.5 font-medium tracking-wide">
                Timestamp
              </th>
              <th className="px-4 py-2.5 font-medium tracking-wide">
                Payment ID
              </th>
              <th className="px-4 py-2.5 font-medium tracking-wide">Amount</th>
              <th className="px-4 py-2.5 font-medium tracking-wide">
                Failure Reason
              </th>
              <th className="px-4 py-2.5 font-medium tracking-wide">
                AI Strategy
              </th>
              <th className="px-4 py-2.5 font-medium tracking-wide">
                Policy Check
              </th>
              <th className="px-4 py-2.5 font-medium tracking-wide">Status</th>
              <th className="px-4 py-2.5 font-medium tracking-wide">
                Action Link
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {logs.map((log) => (
              <tr
                key={log.id}
                className="hover:bg-zinc-900/50 transition-colors"
              >
                <td className="px-4 py-3 text-zinc-500 font-mono">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </td>
                <td className="px-4 py-3 font-mono text-zinc-300">
                  {log.paymentId}
                </td>
                <td className="px-4 py-3 font-mono text-zinc-300">
                  {formatAmount(log.amount)}
                </td>
                <td className="px-4 py-3 text-zinc-400">{log.failureReason}</td>
                <td
                  className="px-4 py-3 max-w-50 truncate"
                  title={log.aiDiagnosis}
                >
                  <div className="text-zinc-300 font-medium">{log.action}</div>
                  <div className="text-[10px] text-zinc-500 truncate mt-0.5">
                    {log.aiDiagnosis}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                      log.policyStatus === "APPROVED"
                        ? "bg-zinc-800 text-zinc-300"
                        : "bg-red-950 text-red-400 border border-red-900/50"
                    }`}
                  >
                    {log.policyStatus}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                      log.recoveryStatus === "RECOVERED"
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-900/50"
                        : log.recoveryStatus === "PENDING"
                          ? "bg-blue-950 text-blue-400 border border-blue-900/50"
                          : log.recoveryStatus === "STOPPED"
                            ? "bg-red-950 text-red-400 border border-red-900/50"
                            : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {log.recoveryStatus}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {log.paymentLinkUrl ? (
                    <a
                      href={log.paymentLinkUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <span>Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-zinc-600">-</span>
                  )}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-zinc-600">
                  No logs recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
