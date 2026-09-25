import { describe, expect, it } from "vitest";
import { healthResponse } from "./health.js";

describe("healthResponse", () => {
  it("returns an API health payload", () => {
    const response = healthResponse();

    expect(response.status).toBe("ok");
    expect(response.service).toBe("api");
    expect(Number.isNaN(Date.parse(response.timestamp))).toBe(false);
  });
});