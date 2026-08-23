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
    triggerSimulation 
  } = useRecoveryData();

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-mono selection:bg-black selection:text-white">
      <header className="border-b-2 border-black bg-white px-6 py-3 flex justify-between items-center z-20 sticky top-0">
        <div className="flex items-center gap-3">
          <Zap className="w-5 h-5 text-black fill-black" />
          <h1 className="text-base font-bold tracking-tight uppercase">
            AI Revenue Recovery Engine
          </h1>
          <span className="ml-2 flex h-3 w-3 bg-black"></span>
        </div>
        
        <div className="flex items-center gap-2 text-sm font-bold">
          <button 
            onClick={togglePolling}
            className="flex items-center gap-2 px-3 py-1.5 border-2 border-black hover:bg-black hover:text-white transition-colors"
          >
            {isPolling ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPolling ? "POLLING: ON" : "POLLING: OFF"}
          </button>
          
          <button 
            onClick={refreshData}
            className="flex items-center gap-2 px-3 py-1.5 border-2 border-black hover:bg-black hover:text-white transition-colors"
            title="Refresh Logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button 
            onClick={triggerSimulation}
            disabled={isSimulating}
            className="flex items-center gap-2 px-4 py-1.5 bg-black hover:bg-white hover:text-black border-2 border-black text-white font-bold transition-colors disabled:opacity-50 ml-2"
          >
            {isSimulating ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
            SIMULATE BATCH
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-4">
          <Metrics metrics={metrics} />
          <div className="flex-1 bg-white border-2 border-black overflow-hidden min-h-125">
             <AuditLog logs={logs} />
          </div>
        </div>
        <div className="col-span-1 lg:col-span-1 bg-white border-2 border-black h-150 lg:h-[calc(100vh-100px)] sticky top-20 overflow-hidden">
          <EventFeed events={events} />
        </div>
      </main>
    </div>
  );
}
