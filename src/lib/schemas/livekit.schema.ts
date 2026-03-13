import { z } from "zod";

export const livekitTokenSchema = z.object({
  token: z.string(),
  url: z.string().url(),
  room: z.string(),
});

export type LivekitToken = z.infer<typeof livekitTokenSchema>;

export const livekitEgressSchema = z.object({
  egressId: z.string(),
  audioUrl: z.string().url(),
});

export type LivekitEgress = z.infer<typeof livekitEgressSchema>;
