import * as fs from "fs";
import * as path from "path";
import { Node } from "../node";

jest.mock("fs");
jest.mock("path");

const mockedFs = jest.mocked(fs);
const mockedPath = jest.mocked(path);

describe("Node", () => {
  let node: Node;

  beforeEach(() => {
    node = new Node();
    jest.clearAllMocks();
  });

  it("should return undefined if package.json file does not exist", async () => {
    mockedPath.join.mockReturnValue("/fake/path/package.json");
    mockedFs.existsSync.mockReturnValue(false);

    const version = await node.getVersion();

    expect(version).toBeUndefined();
    expect(console.log).toHaveBeenCalledWith("package.json file not found.");
  });

  it("should return undefined if package.json file exists but does not contain a Node version", async () => {
    mockedPath.join.mockReturnValue("/fake/path/package.json");
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue(JSON.stringify({}));

    const version = await node.getVersion();

    expect(version).toBeUndefined();
  });

  it("should return the Node version if package.json file exists and contains a Node version", async () => {
    mockedPath.join.mockReturnValue("/fake/path/package.json");
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue(
      JSON.stringify({ engines: { node: "14.x" } }),
    );

    const version = await node.getVersion();

    expect(version).toBe("14.x");
  });
});
