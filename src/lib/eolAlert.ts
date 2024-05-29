import axios from "axios";
import * as core from "@actions/core";
import { AlertFactory } from "../alerts/alertFactory";
import { LanguageFactory } from "../languages/languageFactory";
import { ChannelNames } from "../enums/channelNames";
import { LanguageNames } from "../enums/languageNames";
import { EOLResponse, VersionInfo } from "../types/api";
import assert from "assert";

/**
 * Main function to check EOL versions and send alerts
 */
export async function checkEOLVersions(repoName: string) {
  const languageInput = core.getInput("language");
  if (!languageInput) {
    throw new Error("Language input is required");
  }
  const language = languageInput.toLowerCase() as LanguageNames;

  if (!Object.values(LanguageNames).includes(language)) {
    throw new Error(`Unsupported language: ${languageInput}`);
  }

  const webhookUrls = getWebhookUrls();

  const languageHandler = LanguageFactory.create(language);
  const currentVersion = await languageHandler.getVersion();

  const endOfLifeApiUrl = `https://endoflife.date/api/${language}.json`;

  if (Object.keys(webhookUrls).length === 0) {
    throw new Error("At least one webhook URL must be provided");
  }
  try {
    const response = (await axios.get(endOfLifeApiUrl)) as {
      data: EOLResponse;
    };

    if (response.data.length === 0) {
      console.log("No versions found");
      return;
    }

    const currentVersionInfo = response.data.find(
      (v: VersionInfo) => v.cycle === currentVersion,
    );

    const latestVersionInfo = response.data[0];

    if (!currentVersionInfo) {
      console.log(
        `Current version ${currentVersion} not found in the EOL data.`,
      );
      return;
    }

    // If EOL is boolean, then the version is supported, no need to check EOL
    if (typeof currentVersionInfo.eol === "boolean") {
      return;
    }
    const message = createAlertMessage(
      currentVersionInfo,
      latestVersionInfo,
      language,
      repoName,
    );
    await sendAlerts(webhookUrls, message);
  } catch (error) {
    console.error("Error fetching versions or sending alert:", error);
  }
}

/**
 * Create an alert message based on the current version's EOL status
 * @param currentVersionInfo - Information about the current version
 * @returns Alert message string
 */
function createAlertMessage(
  currentVersionInfo: VersionInfo,
  latestVersionInfo: VersionInfo,
  language: LanguageNames,
  repoName: string,
): string {
  assert(typeof currentVersionInfo.eol === "string", "EOL must be a string");
  const eolDate = new Date(currentVersionInfo.eol);
  const today = new Date();
  const daysUntilEOL = Math.ceil(
    (eolDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (eolDate < today) {
    return `*[Action Required on ${repoName}]* Version upgrade required for ${language} version ${currentVersionInfo.cycle}.
  *${language} version ${currentVersionInfo.cycle}* reached EOL on ${currentVersionInfo.eol}. 
  Latest release of current version: ${currentVersionInfo.latest} on ${currentVersionInfo.latestReleaseDate}.
  Latest release of latest version: ${latestVersionInfo.latest} on ${latestVersionInfo.latestReleaseDate}.`;
  } else if (daysUntilEOL <= 90) {
    // Alert EOL 90 days before
    return `*[Action Required on ${repoName}]* Version will reach EOL soon for ${language} version ${currentVersionInfo.cycle}.
  *${language} version ${currentVersionInfo.cycle}* will reach EOL on ${currentVersionInfo.eol} (in ${daysUntilEOL} days).
  Latest release: ${currentVersionInfo.latest} on ${currentVersionInfo.latestReleaseDate}.
  Latest release of latest version: ${latestVersionInfo.latest} on ${latestVersionInfo.latestReleaseDate}.`;
  } else {
    return `${language} version ${currentVersionInfo.cycle} in ${repoName} will reach EOL on ${currentVersionInfo.eol}.
  Latest release: ${currentVersionInfo.latest} on ${currentVersionInfo.latestReleaseDate}.
  Latest release of latest version: ${latestVersionInfo.latest} on ${latestVersionInfo.latestReleaseDate}.`;
  }
}

/**
 * Send alerts to the specified webhooks
 * @param webhooks - Object containing webhook URLs for different channels
 * @param message - Message to send
 */
async function sendAlerts(
  webhookUrls: { [channel: string]: string },
  message: string,
) {
  for (const [channel, webhookUrl] of Object.entries(webhookUrls)) {
    const alertChannel = AlertFactory.create(
      channel as ChannelNames,
      webhookUrl,
    );
    await alertChannel.sendAlert(message);
  }
}

/**
 * Get webhook URLs from action inputs
 * @returns An object containing webhook URLs for different channels
 */
function getWebhookUrls(): { [channel: string]: string } {
  const webhookUrls: { [channel: string]: string } = {};

  const slackWebhookUrl = core.getInput("slack-webhook-url");
  if (slackWebhookUrl) {
    webhookUrls[ChannelNames.Slack] = slackWebhookUrl;
  }

  const discordWebhookUrl = core.getInput("discord-webhook-url");
  if (discordWebhookUrl) {
    webhookUrls[ChannelNames.Discord] = discordWebhookUrl;
  }

  const teamsWebhookUrl = core.getInput("teams-webhook-url");
  if (teamsWebhookUrl) {
    webhookUrls[ChannelNames.Teams] = teamsWebhookUrl;
  }

  return webhookUrls;
}

export function getRepositoryName(): string {
  const githubRepository = process.env.GITHUB_REPOSITORY;

  if (!githubRepository) {
    throw new Error("GITHUB_REPOSITORY environment variable is not set");
  }

  const [owner, repo] = githubRepository.split("/");
  return repo;
}
