const winston = require('winston');
const path = require('path');
const fs = require('fs');

const isSnapshot = process.pkg !== undefined;
const logDir = isSnapshot ? path.join(path.dirname(process.execPath), 'logs') : path.join(__dirname, 'logs');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFile = path.join(logDir, `${Date.now()}.txt`);

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: logFile })
  ]
});

module.exports = logger;
