import { AlertChannel } from "./alertChannel";
import { SlackAlert } from "./slackAlert";
import { DiscordAlert } from "./discordAlert";
import { TeamsAlert } from "./teamsAlert";
import { ChannelNames } from "../enums/channelNames";

export class AlertFactory {
  public static create(
    channel: ChannelNames,
    webhookUrl: string,
  ): AlertChannel {
    switch (channel) {
      case ChannelNames.Slack:
        return new SlackAlert(webhookUrl);
      case ChannelNames.Discord:
        return new DiscordAlert(webhookUrl);
      case ChannelNames.Teams:
        return new TeamsAlert(webhookUrl);
      default:
        throw new Error(`Unsupported channel: ${channel}`);
    }
  }
}
