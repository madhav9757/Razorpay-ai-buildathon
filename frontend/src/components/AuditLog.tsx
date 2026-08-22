import type { AuditLogEntry } from '../hooks/useRecoveryData';

export function AuditLog({ logs }: { logs: AuditLogEntry[] }) {
  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
        <h3 className="font-semibold text-slate-800">Live Audit Log</h3>
        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">Live</span>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 font-medium">Timestamp</th>
              <th className="px-6 py-3 font-medium">Payment ID</th>
              <th className="px-6 py-3 font-medium">AI Diagnosis</th>
              <th className="px-6 py-3 font-medium">Action</th>
              <th className="px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </td>
                <td className="px-6 py-4 font-medium text-slate-700">{log.paymentId}</td>
                <td className="px-6 py-4">
                  <div className="text-slate-700 font-medium">{log.aiDiagnosis}</div>
                  {log.reasoning && (
                    <div className="text-xs text-slate-500 mt-1 max-w-sm leading-relaxed">
                      {log.reasoning}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-slate-600">{log.actionTaken}</td>
                <td className="px-6 py-4">
                  {log.status === 'Recovered' && <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-medium">Recovered</span>}
                  {log.status === 'Pending' && <span className="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-xs font-medium">Pending</span>}
                  {log.status === 'Failed' && <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-xs font-medium">Failed</span>}
                  {log.status === 'Ignored' && <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-medium">Ignored</span>}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-400">No logs recorded yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
