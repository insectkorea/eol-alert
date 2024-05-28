"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exhaustiveCheck = void 0;
function exhaustiveCheck(param) {
    throw new Error(`Unhandled case: ${param}`);
}
exports.exhaustiveCheck = exhaustiveCheck;
