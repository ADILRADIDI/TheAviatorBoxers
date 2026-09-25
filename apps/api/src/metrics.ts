export const metrics = { requests: 0, errors: 0, startedAt: Date.now() };

export function metricsText() {
  return [
    "# TYPE aviator_http_requests_total counter",
    `aviator_http_requests_total ${metrics.requests}`,
    "# TYPE aviator_http_errors_total counter",
    `aviator_http_errors_total ${metrics.errors}`,
    "# TYPE aviator_process_uptime_seconds gauge",
    `aviator_process_uptime_seconds ${Math.floor((Date.now() - metrics.startedAt) / 1000)}`,
  ].join("\n") + "\n";
}
