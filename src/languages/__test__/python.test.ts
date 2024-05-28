import * as fs from "fs";
import * as path from "path";
import { Python } from "../python";

jest.mock("fs");
jest.mock("path");

const mockedFs = jest.mocked(fs);
const mockedPath = jest.mocked(path);

describe("Python", () => {
  let python: Python;

  beforeEach(() => {
    python = new Python();
    jest.clearAllMocks();
  });

  it("should return undefined if requirements.txt file does not exist", async () => {
    mockedPath.join.mockReturnValue("/fake/path/requirements.txt");
    mockedFs.existsSync.mockReturnValue(false);

    const version = await python.getVersion();

    expect(version).toBeUndefined();
    expect(console.log).toHaveBeenCalledWith(
      "requirements.txt file not found.",
    );
  });

  it("should return undefined if requirements.txt file exists but does not contain a Python version", async () => {
    mockedPath.join.mockReturnValue("/fake/path/requirements.txt");
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue("");

    const version = await python.getVersion();

    expect(version).toBeUndefined();
  });

  it("should return the Python version if requirements.txt file exists and contains a Python version", async () => {
    mockedPath.join.mockReturnValue("/fake/path/requirements.txt");
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue("python==3.8.5");

    const version = await python.getVersion();

    expect(version).toBe("3.8.5");
  });
});
