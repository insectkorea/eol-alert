import { Language } from './language';
export declare class GoLang implements Language {
    getVersion(): Promise<string | undefined>;
}
