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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const core = __importStar(require("@actions/core"));
const fs = __importStar(require("fs"));
const eolAlert_1 = require("./eolAlert");
jest.mock('axios');
jest.mock('@actions/core');
jest.mock('fs', () => ({
    promises: {
        access: jest.fn()
    },
    existsSync: jest.fn(),
    readFileSync: jest.fn()
}));
jest.mock('path');
const mockedAxios = jest.mocked(axios_1.default);
const mockedCore = jest.mocked(core);
const mockedFs = jest.mocked(fs);
describe('checkEOLVersions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('should send an alert for Go versions already EOL to Slack', async () => {
        mockedCore.getInput.mockImplementation((name) => {
            switch (name) {
                case 'slack-webhook-url':
                    return 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX';
                case 'language':
                    return 'golang';
                default:
                    return '';
            }
        });
        mockedFs.existsSync.mockReturnValue(true);
        mockedFs.readFileSync.mockReturnValue('module example.com\n\ngo 1.15');
        mockedAxios.get.mockResolvedValue({
            data: [
                { cycle: '1.15', eol: '2023-02-06', latest: '1.15.14', latestReleaseDate: '2023-02-06' }
            ]
        });
        await (0, eolAlert_1.checkEOLVersions)();
        expect(mockedAxios.post).toHaveBeenCalledWith('https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX', { text: expect.stringContaining('*Version 1.15* reached EOL on 2023-02-06') });
    });
    it('should send an alert for Go versions still supported to Slack', async () => {
        mockedCore.getInput.mockImplementation((name) => {
            switch (name) {
                case 'slack-webhook-url':
                    return 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX';
                case 'language':
                    return 'golang';
                default:
                    return '';
            }
        });
        mockedFs.existsSync.mockReturnValue(true);
        mockedFs.readFileSync.mockReturnValue('module example.com\n\ngo 1.14');
        mockedAxios.get.mockResolvedValue({
            data: [
                { cycle: '1.14', eol: '2025-02-06', latest: '1.14.14', latestReleaseDate: '2023-02-06' }
            ]
        });
        await (0, eolAlert_1.checkEOLVersions)();
        expect(mockedAxios.post).toHaveBeenCalledWith('https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX', { text: expect.stringContaining('*Version 1.14* is currently supported. It will reach EOL on 2025-02-06') });
    });
    it('should handle when the current version is not found in the EOL data', async () => {
        mockedCore.getInput.mockImplementation((name) => {
            switch (name) {
                case 'slack-webhook-url':
                    return 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX';
                case 'language':
                    return 'golang';
                default:
                    return '';
            }
        });
        mockedFs.existsSync.mockReturnValue(true);
        mockedFs.readFileSync.mockReturnValue('module example.com\n\ngo 1.13');
        mockedAxios.get.mockResolvedValue({
            data: [
                { cycle: '1.14', eol: '2025-02-06', latest: '1.14.14', latestReleaseDate: '2023-02-06' }
            ]
        });
        await (0, eolAlert_1.checkEOLVersions)();
        expect(mockedAxios.post).not.toHaveBeenCalled();
        expect(console.log).toHaveBeenCalledWith('Current version 1.13 not found in the EOL data.');
    });
    it('should throw an error if no webhook URLs are provided', async () => {
        mockedCore.getInput.mockImplementation((name) => {
            switch (name) {
                case 'language':
                    return 'golang';
                default:
                    return '';
            }
        });
        await expect((0, eolAlert_1.checkEOLVersions)()).rejects.toThrow('At least one webhook URL must be provided');
    });
    it('should throw an error if no language is provided', async () => {
        mockedCore.getInput.mockImplementation((name) => {
            switch (name) {
                case 'slack-webhook-url':
                    return 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX';
                default:
                    return '';
            }
        });
        await expect((0, eolAlert_1.checkEOLVersions)()).rejects.toThrow('Language input is required');
    });
});
