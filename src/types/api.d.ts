export type VersionInfo = {
  cycle: string;
  releaseDate: string;
  eol: string | boolean;
  latest: string;
  latestReleaseDate: string;
  lts: boolean;
};

export type EOLResponse = VersionInfo[];
