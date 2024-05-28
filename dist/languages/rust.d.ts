import { Language } from './language';
export declare class Rust implements Language {
    getVersion(): Promise<string | undefined>;
}
