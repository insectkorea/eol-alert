import { Language } from './language';
export declare class Node implements Language {
    getVersion(): Promise<string | undefined>;
}
