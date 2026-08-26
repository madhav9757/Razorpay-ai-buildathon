import { useState, useEffect, useCallback } from 'react';

export interface RecoveryMetrics {
  totalRevenueAtRisk: number;
  totalAttempts: number;
  totalRevenueRecovered: number;
  recoveryRate: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  paymentId: string;
  amount: number;
  failureReason: string;
  aiDiagnosis: string;
  action: string;
  policyStatus: 'APPROVED' | 'DENIED';
  recoveryStatus: 'RECOVERED' | 'PENDING' | 'STOPPED' | 'IGNORED';
  paymentLinkUrl?: string;
}

export interface WebhookEvent {
  id: string;
  timestamp: string;
  event: string;
  paymentId: string;
}

export function useRecoveryData() {
  const [metrics, setMetrics] = useState<RecoveryMetrics>({
    totalRevenueAtRisk: 0,
    totalAttempts: 0,
    totalRevenueRecovered: 0,
    recoveryRate: 0,
  });
  
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  
  const [isPolling, setIsPolling] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);

  const fetchMetrics = useCallback(async () => {
    try {
      const [metricsRes, logsRes] = await Promise.all([
        fetch('http://localhost:3000/api/metrics'),
        fetch('http://localhost:3000/api/audit-logs')
      ]);

      if (metricsRes.ok) {
        const data = await metricsRes.json();
        setMetrics(data.metrics);
        setEvents(data.events);
      }
      
      if (logsRes.ok) {
        const data = await logsRes.json();
        setLogs(data);
      }
    } catch (e) {
      console.error("Failed to fetch recovery data", e);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMetrics();
    
    if (isPolling) {
      const interval = setInterval(fetchMetrics, 2000);
      return () => clearInterval(interval);
    }
  }, [fetchMetrics, isPolling]);

  const triggerSimulation = async () => {
    setIsSimulating(true);
    try {
      await fetch('http://localhost:3000/api/simulate', { method: 'POST' });
    } catch (e) {
      console.error("Failed to trigger simulation", e);
    } finally {
      setIsSimulating(false);
    }
  };

  const togglePolling = () => setIsPolling(p => !p);
  const refreshData = () => fetchMetrics();

  return { 
    metrics, 
    logs, 
    events, 
    isPolling, 
    isSimulating, 
    togglePolling, 
    refreshData, 
    triggerSimulation 
  };
}
