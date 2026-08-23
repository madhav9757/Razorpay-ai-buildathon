import type { WebhookEvent } from '../hooks/useRecoveryData';

export function EventFeed({ events }: { events: WebhookEvent[] }) {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="px-4 py-3 border-b-2 border-black bg-white sticky top-0 z-10 flex justify-between items-center">
        <h3 className="text-sm font-bold text-black uppercase tracking-wider">Event Stream</h3>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full bg-black opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 bg-black"></span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-black">Listening</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs">
        {events.map((event) => (
          <div key={event.id} className="bg-white border-2 border-black p-3 hover:bg-black hover:text-white transition-colors group">
            <div className="flex justify-between items-start mb-1.5">
              <span className={`px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase border-2 ${
                event.event === 'payment.failed' ? 'border-black bg-black text-white group-hover:bg-white group-hover:text-black' : 'border-black bg-white text-black group-hover:bg-black group-hover:text-white'
              }`}>
                {event.event}
              </span>
              <span className="font-bold opacity-70">
                {new Date(event.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="font-bold text-sm">
              {event.paymentId}
            </div>
            <div className="font-bold text-[10px] mt-1 opacity-70">
              [STATE] Transitioned to {event.event === 'payment.failed' ? 'RECOVERY_EVALUATION' : 'RECOVERY_COMPLETE'}
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <div className="text-center p-4 font-bold uppercase">
            Awaiting events...
          </div>
        )}
      </div>
    </div>
  );
}
