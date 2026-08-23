import type { WebhookEvent } from "../hooks/useRecoveryData";

export function EventFeed({ events }: { events: WebhookEvent[] }) {
  return (
    <div className="h-full flex flex-col bg-white text-black">
      <div className="px-4 py-2 border-b-2 border-black bg-white sticky top-0 z-10 flex justify-between items-center">
        <h3 className="text-sm font-black uppercase tracking-widest">
          Event Stream
        </h3>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-black animate-pulse" />
          <span className="text-[10px] uppercase font-black tracking-widest">
            Listening
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 font-mono text-xs">
        {events.length === 0 ? (
          <div className="p-6 text-center font-bold uppercase opacity-40 border-2 border-dashed border-black">
            Awaiting Payload...
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="border-2 border-black p-3">
              <div className="flex justify-between items-start mb-2">
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-black tracking-widest uppercase border-2 border-black ${
                    event.event === "payment.failed"
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  }`}
                >
                  {event.event}
                </span>
                <span className="font-bold opacity-60">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="font-black text-sm uppercase">
                {event.paymentId}
              </div>
              <div className="font-bold text-[10px] mt-1 opacity-60 uppercase">
                [STATE]{" "}
                {event.event === "payment.failed"
                  ? "RECOVERY_EVALUATION"
                  : "RECOVERY_COMPLETE"}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
