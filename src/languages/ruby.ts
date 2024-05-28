import * as fs from "fs";
import * as path from "path";
import { Language } from "./language";

export class Ruby implements Language {
  async getVersion(): Promise<string | undefined> {
    const gemfilePath = path.join(process.cwd(), "Gemfile");
    if (!fs.existsSync(gemfilePath)) {
      console.log("Gemfile not found.");
      return undefined;
    }

    const gemfileContent = fs.readFileSync(gemfilePath, "utf8");
    const versionMatch = gemfileContent.match(/ruby\s+'([\d.]+)/i);
    return versionMatch ? versionMatch[1] : undefined;
  }
}
