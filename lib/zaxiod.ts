import type { ZodTypeAny, ZodNever, SafeParseReturnType } from "zod";
import { z } from "zod";

type Zinfer<Z extends ZodTypeAny = ZodNever> = z.infer<Z>;

export type ZaxiodConfig = {
  baseURL: string;
  baseHeaders?: HeadersInit;
};

const GET = { method: "GET" };
const POST = { method: "POST" };
const PUT = { method: "PUT" };
const PATCH = { method: "PATCH" };
const DELETE = { method: "DELETE" };

const zaxiod = (baseConfig: ZaxiodConfig) => ({
  get:
    <Z extends ZodTypeAny = ZodNever>(schema: Z) =>
    async (path: string, headers?: HeadersInit) =>
      await combine<Z>(schema)(baseConfig, path, { ...headers, ...GET }),
  post:
    <Z extends ZodTypeAny = ZodNever>(schema: Z) =>
    async (path: string, data: Zinfer<Z>, headers?: HeadersInit) =>
      await combine<Z>(schema)(baseConfig, path, { ...headers, ...POST }, data),
  put:
    <Z extends ZodTypeAny = ZodNever>(schema: Z) =>
    async (path: string, data: Zinfer<Z>, headers?: HeadersInit) =>
      await combine<Z>(schema)(baseConfig, path, { ...headers, ...PUT }, data),
  patch:
    <Z extends ZodTypeAny = ZodNever>(schema: Z) =>
    async (path: string, data: Partial<Zinfer<Z>>, headers?: HeadersInit) =>
      await combine<Z>(schema)(
        baseConfig,
        path,
        { ...headers, ...PATCH },
        data,
      ),
  delete:
    <Z extends ZodTypeAny = ZodNever>(schema: Z) =>
    async (path: string, headers?: HeadersInit) =>
      await combine<Z>(schema)(baseConfig, path, { ...headers, ...DELETE }),
});

const combine =
  <Z extends ZodTypeAny = ZodNever>(schema: Z) =>
  async (
    baseConfig: ZaxiodConfig,
    path: string,
    headers?: HeadersInit,
    data?: Zinfer<Z> | Partial<Zinfer<Z>>,
  ) => {
    const requestInit: RequestInit = data
      ? {
          ...headers,
          body: JSON.stringify(data),
        }
      : { headers };
    return await fetchWrapper<Z>(baseConfig, schema)(path, requestInit);
  };

const fetchWrapper =
  <Z extends ZodTypeAny = ZodNever>(config: ZaxiodConfig, schema: Z) =>
  async (...args: Parameters<typeof fetch>) => {
    const response = (
      await fetch(`${config.baseURL}${args[0]}`, {
        ...args[1],
        headers: {
          ...config.baseHeaders,
          ...args[1]?.headers,
        },
      })
    ).json();
    return schema.safeParse(response) as SafeParseReturnType<
      Zinfer<Z>,
      Zinfer<Z>
    >;
  };

export { zaxiod };
