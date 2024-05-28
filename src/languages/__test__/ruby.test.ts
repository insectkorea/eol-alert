import * as fs from "fs";
import * as path from "path";
import { Ruby } from "../ruby";

jest.mock("fs");
jest.mock("path");

const mockedFs = jest.mocked(fs);
const mockedPath = jest.mocked(path);

describe("Ruby", () => {
  let ruby: Ruby;

  beforeEach(() => {
    ruby = new Ruby();
    jest.clearAllMocks();
  });

  it("should return undefined if Gemfile does not exist", async () => {
    mockedPath.join.mockReturnValue("/fake/path/Gemfile");
    mockedFs.existsSync.mockReturnValue(false);

    const version = await ruby.getVersion();

    expect(version).toBeUndefined();
    expect(console.log).toHaveBeenCalledWith("Gemfile not found.");
  });

  it("should return undefined if Gemfile exists but does not contain a Ruby version", async () => {
    mockedPath.join.mockReturnValue("/fake/path/Gemfile");
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue("");

    const version = await ruby.getVersion();

    expect(version).toBeUndefined();
  });

  it("should return the Ruby version if Gemfile exists and contains a Ruby version", async () => {
    mockedPath.join.mockReturnValue("/fake/path/Gemfile");
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue("ruby '2.7.1'");

    const version = await ruby.getVersion();

    expect(version).toBe("2.7.1");
  });
});
