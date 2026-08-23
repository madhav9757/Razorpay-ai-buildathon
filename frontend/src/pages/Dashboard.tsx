import { useRecoveryData } from "../hooks/useRecoveryData";
import { Metrics } from "../components/Metrics";
import { AuditLog } from "../components/AuditLog";
import { EventFeed } from "../components/EventFeed";
import { RefreshCw, Play, Pause, Zap } from "lucide-react";

export default function Dashboard() {
  const {
    metrics,
    logs,
    events,
    isPolling,
    isSimulating,
    togglePolling,
    refreshData,
    triggerSimulation,
  } = useRecoveryData();

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-mono selection:bg-black selection:text-white">
      <header className="border-b-2 border-black bg-white px-4 sm:px-6 py-3 flex flex-wrap justify-between items-center sticky top-0 z-30 gap-3">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 fill-black stroke-black" />
          <h1 className="text-sm sm:text-base font-black tracking-tight uppercase">
            AI Revenue Recovery Engine
          </h1>
          <span className="w-2.5 h-2.5 bg-black ml-1 inline-block" />
        </div>

        <div className="flex items-center gap-2 text-xs font-bold uppercase">
          <button
            type="button"
            onClick={togglePolling}
            className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-black hover:bg-black hover:text-white active:bg-black active:text-white"
          >
            {isPolling ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
            <span>Polling: {isPolling ? "ON" : "OFF"}</span>
          </button>

          <button
            type="button"
            onClick={refreshData}
            aria-label="Refresh Data"
            className="p-1.5 border-2 border-black hover:bg-black hover:text-white"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={triggerSimulation}
            disabled={isSimulating}
            className="flex items-center gap-2 px-4 py-1.5 bg-black border-2 border-black text-white hover:bg-white hover:text-black disabled:opacity-40 disabled:pointer-events-none"
          >
            {isSimulating ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>Simulate Batch</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 flex flex-col gap-4">
          <Metrics metrics={metrics} />

          <div className="flex-1 border-2 border-black bg-white overflow-x-auto min-h-120">
            <AuditLog logs={logs} />
          </div>
        </div>

        <aside className="lg:col-span-1 border-2 border-black bg-white h-125 lg:h-[calc(100vh-6rem)] lg:sticky lg:top-20 overflow-hidden flex flex-col">
          <EventFeed events={events} />
        </aside>
      </main>
    </div>
  );
}
