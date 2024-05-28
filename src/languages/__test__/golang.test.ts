import * as fs from "fs";
import * as path from "path";
import { GoLang } from "../golang";

jest.mock("fs");
jest.mock("path");

const mockedFs = jest.mocked(fs);
const mockedPath = jest.mocked(path);

describe("GoLang", () => {
  let goLang: GoLang;

  beforeEach(() => {
    goLang = new GoLang();
    jest.clearAllMocks();
  });

  it("should return undefined if go.mod file does not exist", async () => {
    mockedPath.join.mockReturnValue("/fake/path/go.mod");
    mockedFs.existsSync.mockReturnValue(false);

    const version = await goLang.getVersion();

    expect(version).toBeUndefined();
    expect(console.log).toHaveBeenCalledWith("go.mod file not found.");
  });

  it("should return undefined if go.mod file exists but does not contain a Go version", async () => {
    mockedPath.join.mockReturnValue("/fake/path/go.mod");
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue("module example.com");

    const version = await goLang.getVersion();

    expect(version).toBeUndefined();
  });

  it("should return the Go version if go.mod file exists and contains a Go version", async () => {
    mockedPath.join.mockReturnValue("/fake/path/go.mod");
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue("module example.com\ngo 1.16");

    const version = await goLang.getVersion();

    expect(version).toBe("1.16");
  });
});
