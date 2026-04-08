import fs from "fs";
import path from "path";

const logsDir = path.resolve("logs");

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const appendLog = (fileName, message) => {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFile(path.join(logsDir, fileName), line, (err) => {
    if (err) {
      console.error("Unable to write log:", err.message);
    }
  });
};

export const logInfo = (message) => {
  appendLog("backend.logs", message);
};

export const logError = (message) => {
  appendLog("backend.errors.log", message);
};

export const accessLogStream = fs.createWriteStream(
  path.join(logsDir, "backend.access.logs"),
  { flags: "a" }
);
