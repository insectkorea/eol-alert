"use strict";
const originalLog = console.log;
const originalError = console.error;
beforeAll(() => {
    console.log = jest.fn();
    console.error = jest.fn();
});
afterAll(() => {
    console.log = originalLog;
    console.error = originalError;
});
