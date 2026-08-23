export interface VelocityCheckResult {
  allowed: boolean;
}

class VelocityGuardService {
  private windowSizeMs = 60 * 1000;
  private maxFailures = 3;
  private limits = new Map<string, number[]>();

  public checkVelocity(identifier: string): VelocityCheckResult {
    const now = Date.now();
    let timestamps = this.limits.get(identifier) || [];
    
    timestamps = timestamps.filter(timestamp => now - timestamp < this.windowSizeMs);
    
    if (timestamps.length >= this.maxFailures) {
      this.limits.set(identifier, timestamps);
      return { allowed: false };
    }
    
    timestamps.push(now);
    this.limits.set(identifier, timestamps);
    
    return { allowed: true };
  }
}

export const velocityGuard = new VelocityGuardService();
