import * as fs from "fs";
import * as path from "path";
import { Language } from "./language";

export class Python implements Language {
  async getVersion(): Promise<string | undefined> {
    const requirementsTxtPath = path.join(process.cwd(), "requirements.txt");
    if (!fs.existsSync(requirementsTxtPath)) {
      console.log("requirements.txt file not found.");
      return undefined;
    }

    const requirementsTxtContent = fs.readFileSync(requirementsTxtPath, "utf8");
    const versionMatch = requirementsTxtContent.match(/python==([\d.]+)/i);
    return versionMatch ? versionMatch[1] : undefined;
  }
}
