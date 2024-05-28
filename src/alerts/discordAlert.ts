import axios from "axios";
import { AlertChannel } from "./alertChannel";

export class DiscordAlert implements AlertChannel {
  constructor(private webhookUrl: string) {}

  async sendAlert(message: string): Promise<void> {
    try {
      await axios.post(this.webhookUrl, { content: message });
      console.log("EOL alert sent to Discord.");
    } catch (error) {
      console.error("Error sending Discord alert:", error);
    }
  }
}
