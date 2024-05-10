import { vitest, describe, test, expect } from "vitest";
import { zaxiod } from "./zaxiod";

const MOCK_BASE_URL = "MOCK_BASE_URL";
const MOCK_TOKEN = "MOCK_TOKEN";
const mockLogger = vitest.fn();

describe("Zaxiod", () => {
  test("it works", () => {
    const gateway = zaxiod({
      baseURL: MOCK_BASE_URL,
      onReq: (req) => {
        req.headers = {
          ...req.headers,
          Authorization: MOCK_TOKEN,
        };
        return req;
      },
      onRes: (res) => {
        mockLogger(res.status);
        return res;
      },
    });
    expect(true).toBeTruthy();
  });
});
