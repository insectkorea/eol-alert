import * as fs from "fs";
import * as path from "path";
import { Rust } from "../rust";

jest.mock("fs");
jest.mock("path");

const mockedFs = jest.mocked(fs);
const mockedPath = jest.mocked(path);

describe("Rust", () => {
  let rust: Rust;

  beforeEach(() => {
    rust = new Rust();
    jest.clearAllMocks();
  });

  it("should return undefined if Cargo.toml file does not exist", async () => {
    mockedPath.join.mockReturnValue("/fake/path/Cargo.toml");
    mockedFs.existsSync.mockReturnValue(false);

    const version = await rust.getVersion();

    expect(version).toBeUndefined();
    expect(console.log).toHaveBeenCalledWith("Cargo.toml file not found.");
  });

  it("should return undefined if Cargo.toml file exists but does not contain a Rust edition", async () => {
    mockedPath.join.mockReturnValue("/fake/path/Cargo.toml");
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue("");

    const version = await rust.getVersion();

    expect(version).toBeUndefined();
  });

  it("should return the Rust edition if Cargo.toml file exists and contains a Rust edition", async () => {
    mockedPath.join.mockReturnValue("/fake/path/Cargo.toml");
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue('edition = "2018"');

    const version = await rust.getVersion();

    expect(version).toBe("2018");
  });
});
