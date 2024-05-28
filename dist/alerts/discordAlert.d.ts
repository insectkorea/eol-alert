import { AlertChannel } from './alertChannel';
export declare class DiscordAlert implements AlertChannel {
    private webhookUrl;
    constructor(webhookUrl: string);
    sendAlert(message: string): Promise<void>;
}
