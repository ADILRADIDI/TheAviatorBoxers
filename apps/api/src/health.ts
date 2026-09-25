export function healthResponse() {
  return {
    status: "ok",
    service: "api",
    timestamp: new Date().toISOString(),
  };
}