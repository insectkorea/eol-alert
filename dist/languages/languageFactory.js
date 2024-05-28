"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LanguageFactory = void 0;
const golang_1 = require("./golang");
const node_1 = require("./node");
const python_1 = require("./python");
const ruby_1 = require("./ruby");
const languageNames_1 = require("../enums/languageNames");
const rust_1 = require("./rust");
const exhaustiveCheck_1 = require("../utils/exhaustiveCheck");
class LanguageFactory {
    static create(language) {
        switch (language) {
            case languageNames_1.LanguageNames.GoLang:
                return new golang_1.GoLang();
            case languageNames_1.LanguageNames.Node:
                return new node_1.Node();
            case languageNames_1.LanguageNames.Python:
                return new python_1.Python();
            case languageNames_1.LanguageNames.Ruby:
                return new ruby_1.Ruby();
            case languageNames_1.LanguageNames.Rust:
                return new rust_1.Rust();
            default:
                return (0, exhaustiveCheck_1.exhaustiveCheck)(language);
        }
    }
}
exports.LanguageFactory = LanguageFactory;
