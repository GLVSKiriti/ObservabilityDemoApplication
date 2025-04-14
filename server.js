const { trace, context } = require('@opentelemetry/api');
const os = require("os");
const express = require("express");
const { simulateDBCall, simulateExternalAPI } = require("./utils");
const { client ,register, requestCounter, errorCounter, responseTimeHistogram, availabilityGauge, saturationGauge } = require('./metrics');
const logger = require('./logger');
const tracer = trace.getTracer('api-server', '0.1.0');

const app = express();
const PORT = 3000;

// API Endpoints
app.get("/api1", async (req, res) => handleRequest("/api1", res));
app.get("/api2", async (req, res) => handleRequest("/api2", res));

async function handleRequest(endpoint, res) {
  return tracer.startActiveSpan("HandleRequest", (parentSpan) => {
    return new Promise((resolve) => {
      let current_span = trace.getSpan(context.active());
      let trace_id = current_span.spanContext().traceId;
      let span_id = current_span.spanContext().spanId;

      requestCounter.inc({ endpoint });

      const user_id = `user-${Math.floor(Math.random() * 10)}`;
      const responseTime = Math.random() * 500 + 100;
    
      setTimeout(async () => {
        responseTimeHistogram.observe({ endpoint }, responseTime);
    
        let status;
        const rand = Math.random();
    
        if (rand < 0.25) {
          status = 500;
        } else if (rand < 0.5) {
          status = 404;
        } else {
          status = 200;
        }
    
        if (status !== 200) {
          const status_group = status >= 500 ? "5xx" : "4xx";
          errorCounter.inc({ endpoint, status_group });
    
          logger.error({
            message: `Error response from ${endpoint}`,
            labels: {
              endpoint,
              user_id,
              span_id,
              trace_id
            },
            status,
            responseTime,
          });
        } else {
          logger.info({
            message: `Successful request to ${endpoint}`,
            labels: {
              endpoint,
              user_id,
              span_id,
              trace_id
            },
            status,
            responseTime,
          });
        }
    
        simulateExternalAPI();
        await simulateDBCall();

        parentSpan.end();
        res.status(status).send(`Response with status ${status}`);
        resolve();
      }, responseTime);
    });
  });
}

// Availability updater
setInterval(async () => {
  const metrics = await register.getMetricsAsJSON();
  const totalRequests = metrics.find((m) => m.name === "api_requests_total")?.values || [];
  const errorRequests = metrics.find((m) => m.name === "api_error_count")?.values || [];

  totalRequests.forEach(({ labels, value }) => {
    const endpoint = labels.endpoint;
    if (!endpoint) return;

    const errors = errorRequests.find((e) => e.labels.endpoint === endpoint)?.value || 0;
    const availability = value > 0 ? ((value - errors) / value) * 100 : 100;

    availabilityGauge.set({ endpoint }, availability);
  });
}, 5000);

// Resource usage updater
setInterval(() => {
  const cpuUsage = (os.loadavg()[0] / os.cpus().length) * 100;
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = ((totalMem - freeMem) / totalMem) * 100;

  saturationGauge.set({ resource: "CPU" }, cpuUsage);
  saturationGauge.set({ resource: "Memory" }, usedMem);
}, 5000);

// Prometheus metrics endpoint
app.get("/metrics", async (req, res) => {
  res.setHeader("Content-Type", client.register.contentType);
  res.send(await client.register.metrics());
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
