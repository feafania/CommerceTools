import { TextEncoder as NodeTextEncoder } from "node:util";

import dotenv from "dotenv";

dotenv.config();

process.removeAllListeners("warning");
process.on("warning", (warning) => {
  if (
    !warning.message.includes("punycode") &&
    warning.name !== "DeprecationWarning"
  ) {
    console.warn(warning.name, warning.message);
  }
});

if (typeof TextEncoder === "undefined") {
  globalThis.TextEncoder = NodeTextEncoder;
}

Object.defineProperty(globalThis, "localStorage", {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});
