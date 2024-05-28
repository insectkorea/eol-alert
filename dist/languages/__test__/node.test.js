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
const node_1 = require("../node");
jest.mock('fs');
jest.mock('path');
const mockedFs = jest.mocked(fs);
const mockedPath = jest.mocked(path);
describe('Node', () => {
    let node;
    beforeEach(() => {
        node = new node_1.Node();
        jest.clearAllMocks();
    });
    it('should return undefined if package.json file does not exist', async () => {
        mockedPath.join.mockReturnValue('/fake/path/package.json');
        mockedFs.existsSync.mockReturnValue(false);
        const version = await node.getVersion();
        expect(version).toBeUndefined();
        expect(console.log).toHaveBeenCalledWith('package.json file not found.');
    });
    it('should return undefined if package.json file exists but does not contain a Node version', async () => {
        mockedPath.join.mockReturnValue('/fake/path/package.json');
        mockedFs.existsSync.mockReturnValue(true);
        mockedFs.readFileSync.mockReturnValue(JSON.stringify({}));
        const version = await node.getVersion();
        expect(version).toBeUndefined();
    });
    it('should return the Node version if package.json file exists and contains a Node version', async () => {
        mockedPath.join.mockReturnValue('/fake/path/package.json');
        mockedFs.existsSync.mockReturnValue(true);
        mockedFs.readFileSync.mockReturnValue(JSON.stringify({ engines: { node: '14.x' } }));
        const version = await node.getVersion();
        expect(version).toBe('14.x');
    });
});
