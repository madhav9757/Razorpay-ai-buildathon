import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import type { AuditLogEntry, WebhookEvent } from '../hooks/useRecoveryData';

interface PaymentJourney extends AuditLogEntry {
  timelineEvents: { timestamp: string; event: string }[];
}

export default function PaymentDetail() {
  const { id } = useParams<{ id: string }>();
  const [journey, setJourney] = useState<PaymentJourney | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJourney = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/audit-logs/${id}`);
        if (!res.ok) throw new Error('Journey not found');
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
    return <div className="min-h-screen bg-white text-black p-8 font-mono font-bold uppercase tracking-wider">Loading...</div>;
  }

  if (error || !journey) {
    return (
      <div className="min-h-screen bg-white text-black p-8 font-mono">
        <Link to="/" className="inline-flex items-center gap-2 mb-8 border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-colors font-bold uppercase">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="text-xl font-bold border-2 border-black p-4">Error: {error || 'Payment not found'}</div>
      </div>
    );
  }

  const formatAmount = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  return (
    <div className="min-h-screen bg-white text-black flex flex-col font-mono selection:bg-black selection:text-white">
      <header className="border-b-2 border-black bg-white px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center z-20 sticky top-0 gap-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="inline-flex items-center gap-2 border-2 border-black px-3 py-1.5 hover:bg-black hover:text-white transition-colors font-bold text-sm uppercase">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <h1 className="text-xl font-bold tracking-tight uppercase">
            Payment {journey.paymentId}
          </h1>
        </div>
        <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-sm">
          <span className="bg-black text-white px-3 py-1">
            Status: {journey.recoveryStatus}
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Section 1: Breakdown */}
        <div className="col-span-1 lg:col-span-2 border-2 border-black bg-white p-6 flex flex-col gap-4">
          <h2 className="text-lg font-bold border-b-2 border-black pb-2 uppercase tracking-wide">The Breakdown</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-2">
            <div>
              <div className="text-sm font-bold opacity-60 uppercase mb-1">Amount</div>
              <div className="text-2xl font-bold">{formatAmount(journey.amount)}</div>
            </div>
            <div>
              <div className="text-sm font-bold opacity-60 uppercase mb-1">Failure Reason</div>
              <div className="text-lg font-bold">{journey.failureReason}</div>
            </div>
            <div>
              <div className="text-sm font-bold opacity-60 uppercase mb-1">Time of Failure</div>
              <div className="text-base font-bold">{new Date(journey.timestamp).toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Section 3: Policy & Execution */}
        <div className="col-span-1 border-2 border-black bg-white p-6 flex flex-col gap-4">
          <h2 className="text-lg font-bold border-b-2 border-black pb-2 uppercase tracking-wide">Policy Engine</h2>
          <div className="flex flex-col gap-4 mt-2">
            <div>
              <div className="text-sm font-bold opacity-60 uppercase mb-1">Status</div>
              <div className="text-lg font-bold">{journey.policyStatus}</div>
            </div>
            <div>
              <div className="text-sm font-bold opacity-60 uppercase mb-1">Action</div>
              <div className="text-lg font-bold">{journey.action}</div>
            </div>
            {journey.paymentLinkUrl && (
              <div className="pt-2 border-t-2 border-dashed border-black">
                <div className="text-sm font-bold opacity-60 uppercase mb-2">Recovery Link</div>
                <a 
                  href={journey.paymentLinkUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center justify-between w-full border-2 border-black p-2 hover:bg-black hover:text-white transition-colors font-bold"
                >
                  <span>Open Link</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: AI Reasoning */}
        <div className="col-span-1 md:col-span-2 border-2 border-black bg-black text-white p-6 flex flex-col gap-4">
          <h2 className="text-lg font-bold border-b-2 border-white pb-2 uppercase tracking-wide">AI Reasoning Transcript</h2>
          <div className="mt-2 font-mono text-sm leading-relaxed whitespace-pre-wrap opacity-90">
            &gt; Diagnosing failure for {journey.paymentId}...
            {'\n'}&gt; Reason: {journey.failureReason}
            {'\n'}&gt; Generating response...
            {'\n\n'}{journey.aiDiagnosis}
          </div>
        </div>

        {/* Section 4: Timeline */}
        <div className="col-span-1 md:col-span-2 lg:col-span-1 border-2 border-black bg-white p-6 flex flex-col gap-4">
          <h2 className="text-lg font-bold border-b-2 border-black pb-2 uppercase tracking-wide">Event Timeline</h2>
          <div className="mt-2 flex flex-col gap-4">
            {journey.timelineEvents.map((evt, idx) => (
              <div key={idx} className="relative pl-6">
                <span className="absolute left-0 top-1.5 w-2 h-2 bg-black"></span>
                <div className="text-sm font-bold uppercase tracking-wider">{evt.event}</div>
                <div className="text-xs font-bold opacity-60 mt-0.5">{new Date(evt.timestamp).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
