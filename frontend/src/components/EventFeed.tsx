import type { WebhookEvent } from '../hooks/useRecoveryData';

export function EventFeed({ events }: { events: WebhookEvent[] }) {
  return (
    <div className="h-full flex flex-col bg-zinc-950">
      <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-950 sticky top-0 z-10 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">Event Stream</h3>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Listening</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs">
        {events.map((event) => (
          <div key={event.id} className="bg-zinc-900/50 border border-zinc-800/80 p-3 rounded shadow-sm hover:bg-zinc-900 transition-colors">
            <div className="flex justify-between items-start mb-1.5">
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider ${
                event.event === 'payment.failed' ? 'text-red-400 bg-red-950 border border-red-900/50' : 'text-emerald-400 bg-emerald-950 border border-emerald-900/50'
              }`}>
                {event.event}
              </span>
              <span className="text-zinc-500">
                {new Date(event.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="text-zinc-300">
              {event.paymentId}
            </div>
            <div className="text-zinc-500 text-[10px] mt-1">
              [STATE] Transitioned to {event.event === 'payment.failed' ? 'RECOVERY_EVALUATION' : 'RECOVERY_COMPLETE'}
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <div className="text-center p-4 text-zinc-600">
            Awaiting events...
          </div>
        )}
      </div>
    </div>
  );
}
