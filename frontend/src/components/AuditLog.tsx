import type { AuditLogEntry } from "../hooks/useRecoveryData";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export function AuditLog({ logs }: { logs: AuditLogEntry[] }) {
  const formatAmount = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="px-4 py-3 border-b-2 border-black flex justify-between items-center bg-white">
        <h3 className="text-sm font-bold text-black uppercase tracking-wider">
          Live Audit Trail
        </h3>
        <span className="text-[10px] uppercase font-bold tracking-wider bg-black text-white px-2 py-0.5">
          Live
        </span>
      </div>
      <div className="overflow-x-auto overflow-y-auto flex-1">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-white text-black border-b-2 border-black sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 font-bold tracking-wide uppercase border-r-2 border-black">
                Timestamp
              </th>
              <th className="px-4 py-3 font-bold tracking-wide uppercase border-r-2 border-black">
                Payment ID
              </th>
              <th className="px-4 py-3 font-bold tracking-wide uppercase border-r-2 border-black">
                Amount
              </th>
              <th className="px-4 py-3 font-bold tracking-wide uppercase border-r-2 border-black">
                Failure Reason
              </th>
              <th className="px-4 py-3 font-bold tracking-wide uppercase border-r-2 border-black">
                AI Strategy
              </th>
              <th className="px-4 py-3 font-bold tracking-wide uppercase border-r-2 border-black">
                Policy Check
              </th>
              <th className="px-4 py-3 font-bold tracking-wide uppercase border-r-2 border-black">
                Status
              </th>
              <th className="px-4 py-3 font-bold tracking-wide uppercase">
                Action Link
              </th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black">
            {logs.map((log) => (
              <tr
                key={log.id}
                className="hover:bg-gray-100 transition-colors"
              >
                <td className="px-4 py-3 font-bold border-r-2 border-black">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </td>
                <td className="px-4 py-3 font-bold border-r-2 border-black">
                  <Link to={`/payment/${log.paymentId}`} className="underline hover:bg-black hover:text-white transition-colors px-1">
                    {log.paymentId}
                  </Link>
                </td>
                <td className="px-4 py-3 font-bold border-r-2 border-black">
                  {formatAmount(log.amount)}
                </td>
                <td className="px-4 py-3 font-bold border-r-2 border-black uppercase">{log.failureReason}</td>
                <td
                  className="px-4 py-3 max-w-[200px] truncate border-r-2 border-black"
                  title={log.aiDiagnosis}
                >
                  <div className="font-bold uppercase">{log.action}</div>
                  <div className="text-[10px] font-bold opacity-70 truncate mt-0.5">
                    {log.aiDiagnosis}
                  </div>
                </td>
                <td className="px-4 py-3 border-r-2 border-black">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                      log.policyStatus === "APPROVED"
                        ? "bg-black text-white"
                        : "bg-white text-black border-2 border-black"
                    }`}
                  >
                    {log.policyStatus}
                  </span>
                </td>
                <td className="px-4 py-3 border-r-2 border-black">
                  <span
                    className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase border-2 border-black"
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
                      className="inline-flex items-center gap-1 font-bold underline hover:bg-black hover:text-white px-1 transition-colors"
                    >
                      <span>Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="font-bold">-</span>
                  )}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center font-bold uppercase">
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
