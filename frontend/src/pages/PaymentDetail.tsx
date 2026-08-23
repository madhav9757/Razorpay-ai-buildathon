import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import type { AuditLogEntry } from "../hooks/useRecoveryData";

interface PaymentJourney extends AuditLogEntry {
  timelineEvents: { timestamp: string; event: string }[];
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
      <div className="min-h-screen p-8 font-mono font-bold uppercase tracking-widest">
        Loading...
      </div>
    );
  }

  if (error || !journey) {
    return (
      <div className="min-h-screen p-8 font-mono flex flex-col items-start gap-4">
        <div className="text-xl font-bold border-2 border-black p-4 uppercase">
          Error: {error || "Not found"}
        </div>
        <Link
          to="/"
          className="border-2 border-black px-4 py-2 hover:bg-black hover:text-white font-bold uppercase"
        >
          Return
        </Link>
      </div>
    );
  }

  const formatAmount = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

  return (
    <div className="min-h-screen bg-white text-black font-mono selection:bg-black selection:text-white">
      <header className="border-b-2 border-black px-6 py-4 flex justify-between items-center sticky top-0 bg-white z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 font-bold text-sm uppercase hover:bg-black hover:text-white border-2 border-transparent hover:border-black px-2 py-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <h1 className="text-xl font-black tracking-tighter uppercase hidden sm:block">
          ID: {journey.paymentId}
        </h1>
        <span className="bg-black text-white px-3 py-1 font-bold uppercase text-sm tracking-wider">
          {journey.recoveryStatus}
        </span>
      </header>

      <main className="max-w-7xl mx-auto p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border-2 border-black p-6 flex flex-col gap-6">
          <h2 className="text-sm font-black uppercase tracking-widest border-b-2 border-black pb-2">
            Transaction Data
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <DataPoint label="Amount" value={formatAmount(journey.amount)} />
            <DataPoint label="Reason" value={journey.failureReason} />
            <DataPoint
              label="Time"
              value={new Date(journey.timestamp).toLocaleString()}
            />
          </div>
        </div>

        <div className="border-2 border-black p-6 flex flex-col gap-6">
          <h2 className="text-sm font-black uppercase tracking-widest border-b-2 border-black pb-2">
            Policy Engine
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <DataPoint label="Status" value={journey.policyStatus} />
            <DataPoint label="Action" value={journey.action} />
          </div>
          {journey.paymentLinkUrl && (
            <a
              href={journey.paymentLinkUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-auto border-2 border-black bg-black text-white p-3 font-bold uppercase flex justify-between items-center hover:bg-white hover:text-black"
            >
              <span>Execute Link</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        <div className="lg:col-span-2 border-2 border-black bg-black text-white p-6 flex flex-col gap-4">
          <h2 className="text-sm font-black uppercase tracking-widest border-b-2 border-white pb-2">
            AI Diagnostics
          </h2>
          <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
            {`> Analyzing ${journey.paymentId}...
> Trigger: ${journey.failureReason}
> Generating recovery path...

${journey.aiDiagnosis}`}
          </pre>
        </div>

        <div className="border-2 border-black p-6 flex flex-col gap-4">
          <h2 className="text-sm font-black uppercase tracking-widest border-b-2 border-black pb-2">
            Timeline
          </h2>
          <div className="flex flex-col gap-4 mt-2">
            {journey.timelineEvents.map((evt, idx) => (
              <div key={idx} className="relative pl-4 border-l-2 border-black">
                <span className="absolute -left-1.25 top-1.5 w-2 h-2 bg-black"></span>
                <div className="text-sm font-bold uppercase">{evt.event}</div>
                <div className="text-xs font-bold opacity-60 mt-1">
                  {new Date(evt.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
