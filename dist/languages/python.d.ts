import { Language } from './language';
export declare class Python implements Language {
    getVersion(): Promise<string | undefined>;
}
