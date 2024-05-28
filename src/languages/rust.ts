import * as fs from "fs";
import * as path from "path";
import { Language } from "./language";

export class Rust implements Language {
  async getVersion(): Promise<string | undefined> {
    const cargoTomlPath = path.join(process.cwd(), "Cargo.toml");
    if (!fs.existsSync(cargoTomlPath)) {
      console.log("Cargo.toml file not found.");
      return undefined;
    }

    const cargoTomlContent = fs.readFileSync(cargoTomlPath, "utf8");
    const versionMatch = cargoTomlContent.match(/edition\s*=\s*"([\d.]+)"/i);
    return versionMatch ? versionMatch[1] : undefined;
  }
}
