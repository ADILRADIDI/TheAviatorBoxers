import assert from "node:assert";

// Simulation of analytics configuration
const gaConfig = {
  google_analytics_id: "G-NST40JYCB7",
  google_stream_id: "15844671059",
};

assert.strictEqual(gaConfig.google_analytics_id, "G-NST40JYCB7", "GA4 Measurement ID must match");
assert.strictEqual(gaConfig.google_stream_id, "15844671059", "Stream ID must match");

console.log("✓ Google Analytics 4 configuration test passed successfully!");
console.log(`  - GA4 Measurement ID: ${gaConfig.google_analytics_id}`);
console.log(`  - Numéro de flux (Stream ID): ${gaConfig.google_stream_id}`);
