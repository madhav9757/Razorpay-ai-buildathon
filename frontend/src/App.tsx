import { useRecoveryData } from "./hooks/useRecoveryData";
import { Metrics } from "./components/Metrics";
import { AuditLog } from "./components/AuditLog";
import { EventFeed } from "./components/EventFeed";
import { RefreshCw, Play, Pause, Zap } from "lucide-react";

function App() {
  const { 
    metrics, 
    logs, 
    events, 
    isPolling, 
    isSimulating, 
    togglePolling, 
    refreshData, 
    triggerSimulation 
  } = useRecoveryData();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col font-mono selection:bg-zinc-800">
      <header className="border-b border-zinc-800 bg-zinc-950 px-6 py-3 flex justify-between items-center z-20 sticky top-0 shadow-sm">
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-zinc-100 fill-zinc-100" />
          <h1 className="text-base font-semibold tracking-tight">
            AI Revenue Recovery Engine
          </h1>
          <span className="ml-2 flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <button 
            onClick={togglePolling}
            className="flex items-center gap-2 px-3 py-1.5 border border-zinc-800 hover:bg-zinc-900 rounded transition-colors text-zinc-400 hover:text-zinc-100"
          >
            {isPolling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPolling ? "Auto-Poll: ON" : "Auto-Poll: OFF"}
          </button>
          
          <button 
            onClick={refreshData}
            className="flex items-center gap-2 px-3 py-1.5 border border-zinc-800 hover:bg-zinc-900 rounded transition-colors text-zinc-400 hover:text-zinc-100"
            title="Refresh Logs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button 
            onClick={triggerSimulation}
            disabled={isSimulating}
            className="flex items-center gap-2 px-4 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-medium rounded transition-colors disabled:opacity-50 ml-2"
          >
            {isSimulating ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            Trigger Synthetic Batch
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-4">
          <Metrics metrics={metrics} />
          <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded shadow-sm overflow-hidden min-h-125">
             <AuditLog logs={logs} />
          </div>
        </div>
        <div className="col-span-1 lg:col-span-1 bg-zinc-950 border border-zinc-800 rounded shadow-sm h-150 lg:h-[calc(100vh-140px)] sticky top-20 overflow-hidden">
          <EventFeed events={events} />
        </div>
      </main>
    </div>
  );
}

export default App;
