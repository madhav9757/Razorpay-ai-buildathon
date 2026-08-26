import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Activity,
  BarChart3,
} from "lucide-react";
import type { AuditLogEntry } from "../hooks/useRecoveryData";

interface PaymentJourney extends AuditLogEntry {
  timelineEvents: { timestamp: string; event: string }[];
  // Extended metadata matching your new backend structure
  confidenceScore?: number;
  evrScore?: number;
  operationalCost?: number;
  recommendedChannel?: string;
  customerHook?: string;
  errorCode?: string;
}

const DataPoint = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex flex-col">
    <span className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">
      {label}
    </span>
    <span className="text-lg font-bold">{value}</span>
  </div>
);

export default function PaymentDetail() {
  const { id } = useParams<{ id: string }>();
  const [journey, setJourney] = useState<PaymentJourney | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJourney = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/audit-logs/${id}`);
        if (!res.ok) throw new Error("Journey not found");
        const data = await res.json();
        setJourney(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJourney();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen p-8 font-mono font-bold uppercase tracking-widest bg-white text-black flex items-center justify-center">
        Loading Diagnostic Stream...
      </div>
    );
  }

  if (error || !journey) {
    return (
      <div className="min-h-screen p-8 font-mono flex flex-col items-start gap-4 bg-white text-black">
        <div className="text-xl font-bold border-2 border-black p-4 uppercase">
          Error: {error || "Not found"}
        </div>
        <Link
          to="/"
          className="border-2 border-black px-4 py-2 hover:bg-black hover:text-white font-bold uppercase"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const formatAmount = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;
  const confidencePercentage = journey.confidenceScore
    ? `${(journey.confidenceScore * 100).toFixed(0)}%`
    : "N/A";

  return (
    <div className="min-h-screen bg-white text-black font-mono selection:bg-black selection:text-white">
      <header className="border-b-2 border-black px-6 py-4 flex justify-between items-center sticky top-0 bg-white z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-bold text-sm uppercase hover:bg-black hover:text-white border-2 border-transparent hover:border-black px-2 py-1 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <h1 className="text-base sm:text-xl font-black tracking-tighter uppercase">
          ID: {journey.paymentId}
        </h1>
        <span className="bg-black text-white px-3 py-1 font-bold uppercase text-xs sm:text-sm tracking-wider border-2 border-black">
          {journey.recoveryStatus}
        </span>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction Core Data */}
        <div className="lg:col-span-2 border-2 border-black p-6 flex flex-col gap-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center justify-between border-b-2 border-black pb-2">
            <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-4 h-4" /> Transaction Metadata
            </h2>
            <span className="text-xs font-bold bg-neutral-100 border border-black px-2 py-0.5 uppercase">
              {journey.errorCode || "Razorpay Gateway"}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <DataPoint label="Amount" value={formatAmount(journey.amount)} />
            <DataPoint label="Failure Reason" value={journey.failureReason} />
            <DataPoint
              label="Timestamp"
              value={new Date(journey.timestamp).toLocaleTimeString()}
            />
          </div>
        </div>

        {/* Policy & Economic Unit Metrics (EVR) */}
        <div className="border-2 border-black p-6 flex flex-col gap-6 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="border-b-2 border-black pb-2">
            <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Unit Economics (EVR)
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <DataPoint label="Policy Status" value={journey.policyStatus} />
            <DataPoint label="Chosen Action" value={journey.action} />
            <DataPoint
              label="EVR Score"
              value={
                journey.evrScore !== undefined ? `₹${journey.evrScore}` : "N/A"
              }
            />
            <DataPoint
              label="Ops Cost"
              value={
                journey.operationalCost !== undefined
                  ? `₹${journey.operationalCost}`
                  : "₹2.50"
              }
            />
          </div>
          {journey.paymentLinkUrl && (
            <a
              href={journey.paymentLinkUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-auto border-2 border-black bg-black text-white p-3 font-bold uppercase flex justify-between items-center hover:bg-white hover:text-black transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <span>Execute Payment Link</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Multi-Agent Chain Diagnostics */}
        <div className="lg:col-span-2 border-2 border-black bg-black text-white p-6 flex flex-col gap-4 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
          <div className="border-b-2 border-white pb-2 flex justify-between items-center">
            <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <Cpu className="w-4 h-4" /> Multi-Agent Chain Logs
            </h2>
            <span className="text-xs bg-white text-black px-2 py-0.5 font-bold uppercase">
              Confidence: {confidencePercentage}
            </span>
          </div>
          <pre className="font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-neutral-300">
            {`[NODE 1: DIAGNOSTIC] -> Evaluated error signature... Root cause identified.
[NODE 2: POLICY]      -> Checked risk thresholds & velocity guard... Action: [${journey.action}]
[NODE 3: GENERATIVE]  -> Channel selected: [${journey.recommendedChannel || "SILENT"}]

--- RAW LLM DIAGNOSTIC REASONING ---
${journey.aiDiagnosis}`}
          </pre>
          {journey.customerHook && (
            <div className="mt-2 border border-neutral-700 bg-neutral-900 p-3">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest block mb-1">
                Generated Customer Hook ({journey.recommendedChannel || "WEB"}):
              </span>
              <p className="text-xs sm:text-sm italic">
                "{journey.customerHook}"
              </p>
            </div>
          )}
        </div>

        {/* Audit Timeline */}
        <div className="border-2 border-black p-6 flex flex-col gap-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="border-b-2 border-black pb-2">
            <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Execution Timeline
            </h2>
          </div>
          <div className="flex flex-col gap-4 mt-2 max-h-70 overflow-y-auto pr-2">
            {journey.timelineEvents?.map((evt, idx) => (
              <div key={idx} className="relative pl-4 border-l-2 border-black">
                <span className="absolute -left-1.25 top-1.5 w-2 h-2 bg-black"></span>
                <div className="text-xs sm:text-sm font-bold uppercase">
                  {evt.event}
                </div>
                <div className="text-[10px] font-bold opacity-60 mt-0.5">
                  {new Date(evt.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
