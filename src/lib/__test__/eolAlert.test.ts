import axios from "axios";
import * as core from "@actions/core";
import * as fs from "fs";
import { checkEOLVersions } from "../eolAlert";

jest.mock("axios");
jest.mock("@actions/core");
jest.mock("fs", () => ({
  promises: {
    access: jest.fn(),
  },
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
}));
jest.mock("path");

const mockedAxios = jest.mocked(axios);
const mockedCore = jest.mocked(core);
const mockedFs = jest.mocked(fs);
const repoName = "test-repo";

const fixtureAxiosEOLResp = {
  data: [
    {
      cycle: "1.15",
      eol: "2023-02-06",
      latest: "1.15.14",
      latestReleaseDate: "2023-02-06",
    },
  ],
};

const futureEOLDate = formatDate(
  new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000),
);

describe("checkEOLVersions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should send an alert for Go versions already EOL to Slack", async () => {
    mockedCore.getInput.mockImplementation((name: string) => {
      switch (name) {
        case "slack-webhook-url":
          return "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX";
        case "language":
          return "golang";
        default:
          return "";
      }
    });
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue("module example.com\n\ngo 1.15");
    mockedAxios.get.mockResolvedValue({
      data: [
        {
          cycle: "1.15",
          eol: "2023-02-06",
          latest: "1.15.14",
          latestReleaseDate: "2023-02-06",
        },
      ],
    });

    await checkEOLVersions(repoName);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX",
      {
        text: expect.stringContaining("[Action Required on test-repo]"),
      },
    );
  });

  it("should send an alert for Go versions still supported to Slack", async () => {
    mockedCore.getInput.mockImplementation((name: string) => {
      switch (name) {
        case "slack-webhook-url":
          return "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX";
        case "language":
          return "golang";
        default:
          return "";
      }
    });
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue("module example.com\n\ngo 1.14");
    mockedAxios.get.mockResolvedValue({
      data: [
        {
          cycle: "1.14",
          eol: futureEOLDate,
          latest: "1.14.14",
          latestReleaseDate: "2023-02-06",
        },
      ],
    });

    await checkEOLVersions(repoName);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX",
      {
        text: expect.stringContaining(`will reach EOL on ${futureEOLDate}`),
      },
    );
    expect(console.log).toHaveBeenCalledWith("End of life check for golang ok");
  });

  it("should handle when the current version is not found in the EOL data", async () => {
    mockedCore.getInput.mockImplementation((name: string) => {
      switch (name) {
        case "slack-webhook-url":
          return "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX";
        case "language":
          return "golang";
        default:
          return "";
      }
    });
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue("module example.com\n\ngo 1.13");
    mockedAxios.get.mockResolvedValue({
      data: [
        {
          cycle: "1.14",
          eol: futureEOLDate,
          latest: "1.14.14",
          latestReleaseDate: "2023-02-06",
        },
      ],
    });

    await checkEOLVersions(repoName);

    expect(mockedAxios.post).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(
      "Current version 1.13 not found in the EOL data.",
    );
  });

  it("should throw an error if no language is provided", async () => {
    mockedCore.getInput.mockImplementation((name: string) => {
      switch (name) {
        case "slack-webhook-url":
          return "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX";
        default:
          return "";
      }
    });

    await expect(checkEOLVersions(repoName)).rejects.toThrow(
      "Language input is required",
    );
  });
});

describe("fail-build", () => {
  it("should throw an error when EOL and fail-build=true", async () => {
    mockedCore.getInput.mockImplementation((name: string) => {
      switch (name) {
        case "language":
          return "golang";
        case "fail-build":
          return "true";
        default:
          return "";
      }
    });
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue("module example.com\n\ngo 1.15");
    mockedAxios.get.mockResolvedValue(fixtureAxiosEOLResp);

    await expect(checkEOLVersions(repoName)).rejects.toThrow(
      "End of life check for golang FAILED",
    );
  });

  it("succeeds when EOL and fail-build=false", async () => {
    mockedCore.getInput.mockImplementation((name: string) => {
      switch (name) {
        case "language":
          return "golang";
        case "slack-webhook-url":
          return "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX";
        case "fail-build":
          return "false";
        default:
          return "";
      }
    });
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue("module example.com\n\ngo 1.15");
    mockedAxios.get.mockResolvedValue(fixtureAxiosEOLResp);

    await checkEOLVersions(repoName);

    expect(console.log).toHaveBeenCalledWith(
      `End of life check for golang FAILED, EOL date was ${fixtureAxiosEOLResp.data[0].eol}`,
    );
  });

  it("succeeds when EOL and fail-build unset", async () => {
    mockedCore.getInput.mockImplementation((name: string) => {
      switch (name) {
        case "language":
          return "golang";
        case "slack-webhook-url":
          return "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX";
        default:
          return "";
      }
    });
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue("module example.com\n\ngo 1.15");
    mockedAxios.get.mockResolvedValue(fixtureAxiosEOLResp);

    await checkEOLVersions(repoName);

    expect(console.log).toHaveBeenCalledWith(
      `End of life check for golang FAILED, EOL date was ${fixtureAxiosEOLResp.data[0].eol}`,
    );
  });
});

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}
