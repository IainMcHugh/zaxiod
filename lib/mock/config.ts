import { zaxiod } from "../zaxiod";

const baseHeaders = {
  "Content-Type": "application/json",
};

const gateway = zaxiod({
  baseURL: "https://jsonplaceholder.typicode.com",
  baseHeaders,
});

export { gateway };
