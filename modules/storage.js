import FS from "fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import logger from "./logger.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const fs = FS.promises;

const storagePath = join(__dirname, "..", "db.txt");

async function writeDevices(devices) {
  try {
    await fs.writeFile(storagePath, JSON.stringify(devices, null, 2), "utf-8");
  } catch (err) {
    throw new Error(`Failed to devices to file: ${err.message}`);
  }
}

async function readDevices() {
  try {
    const fileContent = await fs.readFile(storagePath, "utf-8");
    if (fileContent.trim() === "") {
      logger.warn("Storage file is empty, returning empty device list");
      return [];
    }
    return JSON.parse(fileContent);
  } catch (err) {
    if (err.code === "ENOENT") {
      logger.warn("Storage file does not exist, returning empty device list");
      return []; // File does not exist
    }
    throw new Error(`Failed to load devices from file: ${err.message}`);
  }
}

export default {
    writeDevices,
    readDevices,
}