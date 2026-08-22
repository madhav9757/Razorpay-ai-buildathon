import { useRecoveryData } from './hooks/useRecoveryData';
import { Metrics } from './components/Metrics';
import { AuditLog } from './components/AuditLog';
import { EventFeed } from './components/EventFeed';

function App() {
  const { metrics, logs, events } = useRecoveryData();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="border-b bg-white px-6 py-4 flex justify-between items-center shadow-sm z-20 sticky top-0">
        <h1 className="text-xl font-semibold text-slate-900">
          AI Recovery Dashboard
        </h1>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="col-span-1 lg:col-span-3 flex flex-col gap-6">
          <Metrics metrics={metrics} />
          <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-[400px]">
             <AuditLog logs={logs} />
          </div>
        </div>
        <div className="col-span-1 lg:col-span-1 bg-white border border-slate-200 rounded-xl shadow-sm h-[500px] lg:h-[calc(100vh-120px)] sticky top-24 overflow-hidden">
          <EventFeed events={events} />
        </div>
      </main>
    </div>
  );
}

export default App;
