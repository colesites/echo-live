import { z } from "zod";

export const streamEditSchema = z.object({
  title: z.string().min(2, "Stream title is required."),
});
