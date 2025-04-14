# Observability Demo Setup

This guide explains how to run the application and observe metrics, logs, and traces using Grafana and Jaeger.

---

## 🔧 Step 1: Start Observability Tools

Run the following command to start all observability tools (Grafana, Loki, Prometheus, Jaeger) using Docker Compose:

```bash
docker-compose up -d
```

## 🚀 Step 2: Start the Server

Now use the following command to start the application server and also to enable OpenTelemetry tracing.

```bash
node --require tracing.js server.js
```

## 📬 Step 3: Make Requests

Now, send some GET requests to generate logs, metrics, and traces:

```bash
curl http://localhost:3000/api1 http://localhost:3000/api2
```

## 📊 Step 4: Explore Observability Data

You can access **Grafana UI** at: http://localhost:3001  and **Jaeger UI** at http://localhost:16686

Grafana UI has two dashboards
1. API Metrics Dashboard – See request counts, error rates, response time histograms, etc.
2. Log Viewer Dashboard – View structured logs from the application.
