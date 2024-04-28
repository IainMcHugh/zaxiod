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

export const nextServerGateway = zaxiod({
  baseURL: "http://localhost:8000/api",
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
    // 'data' is of type 'Ingredient'
    return response.data;
  } else {
    // 'error' is of type 'ZodError'
    console.log(response.error.message);
    return null;
  }
};
```
