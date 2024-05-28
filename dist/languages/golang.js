"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoLang = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class GoLang {
    async getVersion() {
        const modFilePath = path.join(process.cwd(), 'go.mod');
        if (!fs.existsSync(modFilePath)) {
            console.log('go.mod file not found.');
            return undefined;
        }
        const modFileContent = fs.readFileSync(modFilePath, 'utf8');
        const versionMatch = modFileContent.match(/^go\s+([\d.]+)/m);
        return versionMatch ? versionMatch[1] : undefined;
    }
}
exports.GoLang = GoLang;
