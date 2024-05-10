# Zaxiod

A simple fetch wrapper that combines the API of axios with runtime type-safety of zod. To install:

```zsh
pnpm add zaxiod # or npm, yarn
```

## Usage

Start by setting up gateways in a single file and exporting for use.

```ts
import { zaxiod } from "zaxiod";

const baseHeaders = {
  "Content-type": "application/json",
};

export const gateway = zaxiod({
  baseURL: "http://localhost:8000",
  baseHeaders,
});

export const frontendGateway = zaxiod({
  baseURL: "http://localhost:3000/api",
  baseHeaders,
});
```

The next step is to create your zod schema defining your API structure.

```ts
import { z } from "zod";

const ingredientSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
});

type Ingredient = z.infer<typeof ingredientSchema>;

export { type Ingredient, ingredientSchema };
```

Now you can define your zod-safe API endpoints like so.

```ts
import { gateway } from "@gateways";
import { type Ingredient, ingredientSchema } from "@schema/ingredient.schema";

const findById = async (id: number) => {
  return await gateway.get(ingredientSchema)(`/ingredient/${id}`, {
    headers: { /** Some specific headers */}
  });
};

const create = async (payload: Ingredient) => {
  return await gateway.post(ingredientSchema)(`/ingredient`, payload);
};

const update = async (payload: Partial<Ingredient>) => {
  return await gateway.patch(ingredientSchema)(`/ingredient`, payload);
};

const delete = async (id: number) => {
  return await gateway.delete(ingredientSchema)(`/ingredient/${id}`);
};

export const ingredients = {
  findById,
  create,
  update,
  delete
};
```

And use! By passing the schema you are guaranteeing the return type to be safe-parsed by `zod`.

```ts
const getMyIngredient = async (): Promise<Ingredient | null> => {
  const response = await ingredients.findById(23);
  if (response.success) {
    // awaited 'data' is of type 'Ingredient'
    return await response.data;
  } else {
    // 'error' is of type 'ZodError'
    console.log(response.error.message);
    return null;
  }
};
```

## Interceptors

Sometimes you will want to attach interceptors for all requests going through a particular gateway. A common use case for this is sending authorization tokens with each request.

```ts
const gateway = zaxiod({
  baseURL: "http://localhost:8000",
  onReq: (req) => {
    req.headers = {
      ...req.headers,
      Authorization: `Bearer ${token}`,
    };
    // must return req
    return req;
  },
  onRes: (res) => {
    logService.log(res.status);
    // must return res
    return res;
  },
});
```

As you will most likely need to pass the `token` from within the appropriate point in your code, you can structure your code like this:

```ts
const getServerProps = async (context: ServerContext) => {
  const id = context.query;
  const token = await getToken(context);
  const api = zaxiod(getGateway(token);
  const ingredientsResponse = await api.ingredients.findById(id);
  if (ingredientsResponse.success) {
    const ingredients = await ingredientsResponse.data;
    return {
      props: {
        ingredients,
      },
    };
  } else {
    context.logger.error(ingredientsResponse.error);
    return null;
  }
};
```
