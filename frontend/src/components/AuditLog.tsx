import type { AuditLogEntry } from "../hooks/useRecoveryData";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export function AuditLog({ logs }: { logs: AuditLogEntry[] }) {
  const formatAmount = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

  return (
    <div className="h-full flex flex-col bg-white text-black">
      {/* Header */}
      <div className="px-4 py-2 border-b-2 border-black flex justify-between items-center sticky top-0 bg-white z-20">
        <h3 className="text-sm font-black uppercase tracking-widest">
          Audit Trail
        </h3>
        <span className="text-[10px] uppercase font-bold tracking-widest bg-black text-white px-2 py-0.5">
          Live Data
        </span>
      </div>

      {/* Table Container */}
      <div className="overflow-auto flex-1">
        <table className="w-full text-left text-xs whitespace-nowrap border-collapse">
          <thead className="bg-white border-b-2 border-black sticky top-0 z-10">
            <tr>
              {[
                "Time",
                "Payment ID",
                "Amount",
                "Trigger",
                "Strategy",
                "Policy",
                "Status",
                "Action",
              ].map((heading) => (
                <th
                  key={heading}
                  className="px-4 py-3 font-black tracking-widest uppercase border-r-2 border-black last:border-r-0"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y-2 divide-black">
            {logs.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-12 text-center font-bold uppercase opacity-50"
                >
                  No interventions recorded.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-100">
                  <td className="px-4 py-3 font-bold border-r-2 border-black">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>

                  <td className="px-4 py-3 font-bold border-r-2 border-black">
                    <Link
                      to={`/payment/${log.paymentId}`}
                      className="underline hover:bg-black hover:text-white px-1"
                    >
                      {log.paymentId}
                    </Link>
                  </td>

                  <td className="px-4 py-3 font-bold border-r-2 border-black">
                    {formatAmount(log.amount)}
                  </td>

                  <td className="px-4 py-3 font-bold border-r-2 border-black uppercase">
                    {log.failureReason}
                  </td>

                  <td className="px-4 py-3 max-w-55 truncate border-r-2 border-black">
                    <div className="font-black uppercase">{log.action}</div>
                    <div className="text-[10px] font-bold opacity-60 truncate mt-0.5">
                      {log.aiDiagnosis}
                    </div>
                  </td>

                  <td className="px-4 py-3 border-r-2 border-black">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase ${
                        log.policyStatus === "APPROVED"
                          ? "bg-black text-white"
                          : "border-2 border-black"
                      }`}
                    >
                      {log.policyStatus}
                    </span>
                  </td>

                  <td className="px-4 py-3 border-r-2 border-black">
                    <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase border-2 border-black">
                      {log.recoveryStatus}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    {log.paymentLinkUrl ? (
                      <a
                        href={log.paymentLinkUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-bold underline hover:bg-black hover:text-white px-1"
                      >
                        Execute <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="font-bold opacity-30">N/A</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
