class MetricsService {
  private state = {
    total_revenue_at_risk: 0,
    total_recovery_attempts: 0,
    total_revenue_recovered: 0
  };

  private logs: any[] = [];
  private events: any[] = [];

  logRisk(amount: number) {
    this.state.total_revenue_at_risk += amount;
  }

  logAttempt() {
    this.state.total_recovery_attempts += 1;
  }

  logRecoverySuccess(amount: number) {
    this.state.total_revenue_recovered += amount;
  }

  addLog(log: any) {
    this.logs.unshift({ ...log, id: Math.random().toString(), timestamp: new Date().toISOString() });
    if (this.logs.length > 50) this.logs.pop();
  }

  updateLogStatus(paymentId: string, status: string) {
    const log = this.logs.find(l => l.paymentId === paymentId);
    if (log) log.status = status;
  }

  addEvent(event: any) {
    this.events.unshift({ ...event, id: Math.random().toString(), timestamp: new Date().toISOString() });
    if (this.events.length > 50) this.events.pop();
  }

  getMetrics() {
    return { 
      metrics: { ...this.state },
      logs: [...this.logs],
      events: [...this.events]
    };
  }
}

export const metricsService = new MetricsService();
