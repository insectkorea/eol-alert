"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordAlert = void 0;
const axios_1 = __importDefault(require("axios"));
class DiscordAlert {
    constructor(webhookUrl) {
        this.webhookUrl = webhookUrl;
    }
    async sendAlert(message) {
        try {
            await axios_1.default.post(this.webhookUrl, { content: message });
            console.log('EOL alert sent to Discord.');
        }
        catch (error) {
            console.error('Error sending Discord alert:', error);
        }
    }
}
exports.DiscordAlert = DiscordAlert;
