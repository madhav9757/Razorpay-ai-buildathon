import { useState, useEffect } from 'react';

export interface RecoveryMetrics {
  total_revenue_at_risk: number;
  total_recovery_attempts: number;
  total_revenue_recovered: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  paymentId: string;
  aiDiagnosis: string;
  actionTaken: string;
  status: string;
  reasoning?: string;
}

export interface WebhookEvent {
  id: string;
  timestamp: string;
  event: string;
  paymentId: string;
}

export function useRecoveryData() {
  const [metrics, setMetrics] = useState<RecoveryMetrics>({
    total_revenue_at_risk: 0,
    total_recovery_attempts: 0,
    total_revenue_recovered: 0,
  });
  
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [events, setEvents] = useState<WebhookEvent[]>([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/metrics');
        if (res.ok) {
          const data = await res.json();
          setMetrics(data.metrics);
          setLogs(data.logs);
          setEvents(data.events);
        }
      } catch (e) {
        console.error("Failed to fetch metrics", e);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 2000);
    return () => clearInterval(interval);
  }, []);

  return { metrics, logs, events };
}
