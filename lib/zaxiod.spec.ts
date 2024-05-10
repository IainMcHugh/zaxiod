import { vitest, describe, test, expect } from "vitest";
import { zaxiod } from "./zaxiod";
import { z } from "zod";

const MOCK_BASE_URL = "MOCK_BASE_URL";
const MOCK_TOKEN = "MOCK_TOKEN";
const mockLogger = vitest.fn();

const mockSchema = z.object({
  id: z.number(),
});

describe("Zaxiod", () => {
  test("it works", async () => {
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
    const response = await gateway.get(mockSchema)("/api");
    if (response.success) {
      const data = await response.data;
      console.log(data);
    } else {
      const error = response.error.message;
      console.log(error);
    }
    expect(true).toBeTruthy();
  });
});
