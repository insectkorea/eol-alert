"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamsAlert = void 0;
const axios_1 = __importDefault(require("axios"));
class TeamsAlert {
    constructor(webhookUrl) {
        this.webhookUrl = webhookUrl;
    }
    async sendAlert(message) {
        try {
            await axios_1.default.post(this.webhookUrl, { text: message });
            console.log('EOL alert sent to Teams.');
        }
        catch (error) {
            console.error('Error sending Teams alert:', error);
        }
    }
}
exports.TeamsAlert = TeamsAlert;
