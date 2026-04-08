import client from "prom-client";

const register = new client.Registry();

register.setDefaultLabels({
  app: "jobhunt-backend",
});

client.collectDefaultMetrics({ register });

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in milliseconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [25, 50, 100, 250, 500, 1000, 2000, 5000],
  registers: [register],
});

const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

export const metricsMiddleware = (req, res, next) => {
  const startedAt = process.hrtime.bigint();

  res.on("finish", () => {
    const route = req.route?.path || req.path || "unknown";
    const statusCode = String(res.statusCode);
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;

    httpRequestDuration
      .labels(req.method, route, statusCode)
      .observe(durationMs);
    httpRequestsTotal.labels(req.method, route, statusCode).inc();
  });

  next();
};

export const metricsHandler = async (_req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
};
