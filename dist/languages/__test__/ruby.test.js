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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const ruby_1 = require("../ruby");
jest.mock('fs');
jest.mock('path');
const mockedFs = jest.mocked(fs);
const mockedPath = jest.mocked(path);
describe('Ruby', () => {
    let ruby;
    beforeEach(() => {
        ruby = new ruby_1.Ruby();
        jest.clearAllMocks();
    });
    it('should return undefined if Gemfile does not exist', async () => {
        mockedPath.join.mockReturnValue('/fake/path/Gemfile');
        mockedFs.existsSync.mockReturnValue(false);
        const version = await ruby.getVersion();
        expect(version).toBeUndefined();
        expect(console.log).toHaveBeenCalledWith('Gemfile not found.');
    });
    it('should return undefined if Gemfile exists but does not contain a Ruby version', async () => {
        mockedPath.join.mockReturnValue('/fake/path/Gemfile');
        mockedFs.existsSync.mockReturnValue(true);
        mockedFs.readFileSync.mockReturnValue('');
        const version = await ruby.getVersion();
        expect(version).toBeUndefined();
    });
    it('should return the Ruby version if Gemfile exists and contains a Ruby version', async () => {
        mockedPath.join.mockReturnValue('/fake/path/Gemfile');
        mockedFs.existsSync.mockReturnValue(true);
        mockedFs.readFileSync.mockReturnValue("ruby '2.7.1'");
        const version = await ruby.getVersion();
        expect(version).toBe('2.7.1');
    });
});
