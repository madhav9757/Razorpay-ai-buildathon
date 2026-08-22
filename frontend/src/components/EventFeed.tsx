import type { WebhookEvent } from '../hooks/useRecoveryData';

export function EventFeed({ events }: { events: WebhookEvent[] }) {
  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="px-5 py-4 border-b border-slate-200 bg-white sticky top-0 z-10">
        <h3 className="font-semibold text-slate-800">Webhook Events</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {events.map((event) => (
          <div key={event.id} className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                event.event === 'payment.failed' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
              }`}>
                {event.event}
              </span>
              <span className="text-xs text-slate-400">
                {new Date(event.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="text-sm font-medium text-slate-700 mt-2">
              {event.paymentId}
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <div className="text-center p-4 text-sm text-slate-400">
            Awaiting events...
          </div>
        )}
      </div>
    </div>
  );
}
