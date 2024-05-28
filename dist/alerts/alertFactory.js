"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertFactory = void 0;
const slackAlert_1 = require("./slackAlert");
const discordAlert_1 = require("./discordAlert");
const teamsAlert_1 = require("./teamsAlert");
const channelNames_1 = require("../enums/channelNames");
class AlertFactory {
    static create(channel, webhookUrl) {
        switch (channel) {
            case channelNames_1.ChannelNames.Slack:
                return new slackAlert_1.SlackAlert(webhookUrl);
            case channelNames_1.ChannelNames.Discord:
                return new discordAlert_1.DiscordAlert(webhookUrl);
            case channelNames_1.ChannelNames.Teams:
                return new teamsAlert_1.TeamsAlert(webhookUrl);
            default:
                throw new Error(`Unsupported channel: ${channel}`);
        }
    }
}
exports.AlertFactory = AlertFactory;
