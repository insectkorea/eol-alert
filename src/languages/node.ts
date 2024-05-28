import * as fs from "fs";
import * as path from "path";
import { Language } from "./language";

export class Node implements Language {
  async getVersion(): Promise<string | undefined> {
    const packageJsonPath = path.join(process.cwd(), "package.json");
    if (!fs.existsSync(packageJsonPath)) {
      console.log("package.json file not found.");
      return undefined;
    }

    const packageJsonContent = fs.readFileSync(packageJsonPath, "utf8");
    const packageJson = JSON.parse(packageJsonContent);
    return packageJson.engines && packageJson.engines.node
      ? packageJson.engines.node
      : undefined;
  }
}
