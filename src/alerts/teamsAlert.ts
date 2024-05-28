import axios from "axios";
import { AlertChannel } from "./alertChannel";

export class TeamsAlert implements AlertChannel {
  constructor(private webhookUrl: string) {}

  async sendAlert(message: string): Promise<void> {
    try {
      await axios.post(this.webhookUrl, { text: message });
      console.log("EOL alert sent to Teams.");
    } catch (error) {
      console.error("Error sending Teams alert:", error);
    }
  }
}
