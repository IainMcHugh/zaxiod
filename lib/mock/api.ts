import { gateway } from "./config";
import { schema } from "./schema";

const get = async () => {
  return await gateway.get(schema)("/todos/1");
};

export const api = { get };
