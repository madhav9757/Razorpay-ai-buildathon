class MetricsService {
  private state = {
    total_revenue_at_risk: 0,
    total_recovery_attempts: 0,
    total_revenue_recovered: 0
  };

  logRisk(amount: number) {
    this.state.total_revenue_at_risk += amount;
  }

  logAttempt() {
    this.state.total_recovery_attempts += 1;
  }

  logRecoverySuccess(amount: number) {
    this.state.total_revenue_recovered += amount;
  }

  getMetrics() {
    return { ...this.state };
  }
}

export const metricsService = new MetricsService();
