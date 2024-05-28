import { Language } from './language';
export declare class Ruby implements Language {
    getVersion(): Promise<string | undefined>;
}
