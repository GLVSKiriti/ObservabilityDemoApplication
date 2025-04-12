const client = require("prom-client");

// Prometheus setup
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const responseTimeHistogram = new client.Histogram({
    name: "api_response_time_ms",
    help: "Response time of API requests in milliseconds",
    labelNames: ["endpoint"],
    buckets: [50, 100, 200, 500, 1000, 2000],
});

const requestCounter = new client.Counter({
    name: "api_requests_total",
    help: "Total number of requests",
    labelNames: ["endpoint"],
});

const errorCounter = new client.Counter({
    name: "api_error_count",
    help: "Total number of failed requests",
    labelNames: ["endpoint", "status_group"],
});

const availabilityGauge = new client.Gauge({
    name: "api_availability",
    help: "API uptime percentage",
    labelNames: ["endpoint"],
});

const saturationGauge = new client.Gauge({
    name: "api_saturation",
    help: "System resource usage (CPU & memory)",
    labelNames: ["resource"],
});

register.registerMetric(responseTimeHistogram);
register.registerMetric(requestCounter);
register.registerMetric(errorCounter);
register.registerMetric(availabilityGauge);
register.registerMetric(saturationGauge);

module.exports = {
    client,
    register,
    responseTimeHistogram,
    requestCounter,
    errorCounter,
    availabilityGauge,
    saturationGauge,
};