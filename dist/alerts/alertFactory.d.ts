import { AlertChannel } from './alertChannel';
import { ChannelNames } from '../enums/channelNames';
export declare class AlertFactory {
    static create(channel: ChannelNames, webhookUrl: string): AlertChannel;
}
