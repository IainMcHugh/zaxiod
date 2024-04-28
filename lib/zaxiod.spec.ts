import { describe, test, expect } from "vitest";
import { zaxiod } from "./zaxiod";

const MOCK_BASE_URL = "MOCK_BASE_URL";

describe("Axiod", () => {
  test("it works", () => {
    const gateway = zaxiod({ baseURL: MOCK_BASE_URL });
    expect(true).toBeTruthy();
  });
});
