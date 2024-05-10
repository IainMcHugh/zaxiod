import { z } from "zod";

const schema = z.object({ id: z.number() });

export { schema };
