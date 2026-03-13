import { z } from "zod";

export const createSourceSchema = z.object({
  name: z.string().min(2, "Source name is required."),
  type: z.string().min(2, "Source type is required."),
});
