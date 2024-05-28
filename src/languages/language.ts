export interface Language {
  getVersion(): Promise<string | undefined>;
}
