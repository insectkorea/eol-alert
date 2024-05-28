import * as fs from "fs";
import * as path from "path";
import { Language } from "./language";

export class GoLang implements Language {
  async getVersion(): Promise<string | undefined> {
    const modFilePath = path.join(process.cwd(), "go.mod");
    if (!fs.existsSync(modFilePath)) {
      console.log("go.mod file not found.");
      return undefined;
    }

    const modFileContent = fs.readFileSync(modFilePath, "utf8");
    const versionMatch = modFileContent.match(/^go\s+([\d.]+)/m);
    return versionMatch ? versionMatch[1] : undefined;
  }
}
