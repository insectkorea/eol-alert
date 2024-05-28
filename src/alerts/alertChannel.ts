export interface AlertChannel {
  sendAlert(message: string): Promise<void>;
}
