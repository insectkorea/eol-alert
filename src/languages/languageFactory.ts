import { Language } from "./language";
import { GoLang } from "./golang";
import { Node } from "./node";
import { Python } from "./python";
import { Ruby } from "./ruby";
import { LanguageNames } from "../enums/languageNames";
import { Rust } from "./rust";
import { exhaustiveCheck } from "../utils/exhaustiveCheck";

export class LanguageFactory {
  public static create(language: LanguageNames): Language {
    switch (language) {
      case LanguageNames.GoLang:
        return new GoLang();
      case LanguageNames.Node:
        return new Node();
      case LanguageNames.Python:
        return new Python();
      case LanguageNames.Ruby:
        return new Ruby();
      case LanguageNames.Rust:
        return new Rust();
      default:
        return exhaustiveCheck(language);
    }
  }
}
