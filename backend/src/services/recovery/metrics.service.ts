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

class MetricsService {
  private state = {
    totalRevenueAtRisk: 0,
    totalAttempts: 0,
    totalRevenueRecovered: 0
  };

  private logs: AuditLogEntry[] = [];
  private events: any[] = [];
  private recoveryAttemptsCounter: Record<string, number> = {};

  logRisk(amount: number) {
    this.state.totalRevenueAtRisk += amount;
  }

  logAttempt(paymentId: string) {
    this.state.totalAttempts += 1;
    this.recoveryAttemptsCounter[paymentId] = (this.recoveryAttemptsCounter[paymentId] || 0) + 1;
  }

  getAttempts(paymentId: string): number {
    return this.recoveryAttemptsCounter[paymentId] || 0;
  }

  logRecoverySuccess(amount: number) {
    this.state.totalRevenueRecovered += amount;
  }

  addLog(log: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
    this.logs.unshift({ ...log, id: Math.random().toString(), timestamp: new Date().toISOString() });
    if (this.logs.length > 50) this.logs.pop();
  }

  updateLogStatus(paymentId: string, updates: Partial<AuditLogEntry>) {
    const log = this.logs.find(l => l.paymentId === paymentId);
    if (log) {
      Object.assign(log, updates);
    }
  }

  addEvent(event: any) {
    this.events.unshift({ ...event, id: Math.random().toString(), timestamp: new Date().toISOString() });
    if (this.events.length > 50) this.events.pop();
  }

  getMetrics() {
    const recoveryRate = this.state.totalRevenueAtRisk > 0 
      ? (this.state.totalRevenueRecovered / this.state.totalRevenueAtRisk) * 100 
      : 0;

    return { 
      metrics: { 
        ...this.state,
        recoveryRate
      },
      events: [...this.events]
    };
  }

  getAuditLogs() {
    return this.logs;
  }

  getPaymentJourney(paymentId: string) {
    const log = this.logs.find(l => l.paymentId === paymentId);
    if (!log) return null;
    const timelineEvents = this.events
      .filter(e => e.paymentId === paymentId || (e.payload?.payment_link?.entity?.notes?.original_payment_id === paymentId))
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map(e => ({ timestamp: e.timestamp, event: e.event }));
    return {
      ...log,
      timelineEvents
    };
  }
}

export const metricsService = new MetricsService();
