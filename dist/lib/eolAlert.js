"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEOLVersions = void 0;
const axios_1 = __importDefault(require("axios"));
const core = __importStar(require("@actions/core"));
const alertFactory_1 = require("../alerts/alertFactory");
const languageFactory_1 = require("../languages/languageFactory");
const channelNames_1 = require("../enums/channelNames");
const languageNames_1 = require("../enums/languageNames");
/**
 * Main function to check EOL versions and send alerts
 */
async function checkEOLVersions() {
    const languageInput = core.getInput('language');
    if (!languageInput) {
        throw new Error('Language input is required');
    }
    const language = languageInput.toLowerCase();
    if (!Object.values(languageNames_1.LanguageNames).includes(language)) {
        throw new Error(`Unsupported language: ${languageInput}`);
    }
    const webhookUrls = getWebhookUrls();
    const languageHandler = languageFactory_1.LanguageFactory.create(language);
    const currentVersion = await languageHandler.getVersion();
    const endOfLifeApiUrl = `https://endoflife.date/api/${language}.json`;
    if (Object.keys(webhookUrls).length === 0) {
        throw new Error('At least one webhook URL must be provided');
    }
    try {
        const response = await axios_1.default.get(endOfLifeApiUrl);
        if (response.data.length === 0) {
            console.log('No versions found');
            return;
        }
        const currentVersionInfo = response.data.find((v) => v.cycle === currentVersion);
        if (!currentVersionInfo) {
            console.log(`Current version ${currentVersion} not found in the EOL data.`);
            return;
        }
        const message = createAlertMessage(currentVersionInfo);
        await sendAlerts(webhookUrls, message);
    }
    catch (error) {
        console.error('Error fetching versions or sending alert:', error);
    }
}
exports.checkEOLVersions = checkEOLVersions;
/**
 * Create an alert message based on the current version's EOL status
 * @param currentVersionInfo - Information about the current version
 * @returns Alert message string
 */
function createAlertMessage(currentVersionInfo) {
    const eolDate = new Date(currentVersionInfo.eol);
    const today = new Date();
    const daysUntilEOL = Math.ceil((eolDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (eolDate < today) {
        return `*Version ${currentVersionInfo.cycle}* reached EOL on ${currentVersionInfo.eol}. Latest release: ${currentVersionInfo.latest} on ${currentVersionInfo.latestReleaseDate}`;
    }
    else if (daysUntilEOL <= 30) {
        return `*Version ${currentVersionInfo.cycle}* will reach EOL on ${currentVersionInfo.eol} (in ${daysUntilEOL} days). Latest release: ${currentVersionInfo.latest} on ${currentVersionInfo.latestReleaseDate}`;
    }
    else {
        return `*Version ${currentVersionInfo.cycle}* is currently supported. It will reach EOL on ${currentVersionInfo.eol}. Latest release: ${currentVersionInfo.latest} on ${currentVersionInfo.latestReleaseDate}`;
    }
}
/**
 * Send alerts to the specified webhooks
 * @param webhooks - Object containing webhook URLs for different channels
 * @param message - Message to send
 */
async function sendAlerts(webhookUrls, message) {
    for (const [channel, webhookUrl] of Object.entries(webhookUrls)) {
        const alertChannel = alertFactory_1.AlertFactory.create(channel, webhookUrl);
        await alertChannel.sendAlert(message);
    }
}
/**
 * Get webhook URLs from action inputs
 * @returns An object containing webhook URLs for different channels
 */
function getWebhookUrls() {
    const webhookUrls = {};
    const slackWebhookUrl = core.getInput('slack-webhook-url');
    if (slackWebhookUrl) {
        webhookUrls[channelNames_1.ChannelNames.Slack] = slackWebhookUrl;
    }
    const discordWebhookUrl = core.getInput('discord-webhook-url');
    if (discordWebhookUrl) {
        webhookUrls[channelNames_1.ChannelNames.Discord] = discordWebhookUrl;
    }
    const teamsWebhookUrl = core.getInput('teams-webhook-url');
    if (teamsWebhookUrl) {
        webhookUrls[channelNames_1.ChannelNames.Teams] = teamsWebhookUrl;
    }
    return webhookUrls;
}
