export type AlertSeverity = 'info' | 'warning' | 'critical';
export type AlertType = 'trend' | 'threshold' | 'geographic';

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  region?: string;
  state?: string;
  timestamp: Date;
  data: {
    currentValue: number;
    previousValue: number;
    percentChange: number;
  };
}

export interface AlertConfig {
  enabled: boolean;
  trendThreshold: number; // e.g., 20% increase
  trendWindow: number; // e.g., 4 weeks
  monitoredStates: string[];
}
