// logger.js
import winston from "winston";

// Define log levels and corresponding colors
export const logLevels = {
  error: "error",
  warn: "warn",
  info: "info",
  debug: "debug",
};

// Configure Winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "./logs/error.log",
      level: "error",
    }),
    new winston.transports.File({ filename: "./logs/combined.log" }),
  ],
});

export default logger;
