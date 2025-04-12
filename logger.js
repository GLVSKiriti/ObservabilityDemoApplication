const { createLogger, transports, format } = require("winston");
const LokiTransport = require("winston-loki");

// Logger setup
const logger = createLogger({
    transports: [
    new LokiTransport({
        host: "http://127.0.0.1:3100",
        labels: { app: "node-app" },
        json: true,
        format: format.json(),
        replaceTimestamp: true,
        onConnectionError: (err) => console.error(err),
    }),
    new transports.Console({
        format: format.simple(),
    }),
    ],
});

module.exports = logger;