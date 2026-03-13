import { z } from "zod";

export const eqBandSchema = z.object({
  id: z.string(),
  gain: z.number(),
});

export const audioProcessingSchema = z.object({
  noiseSuppression: z.boolean(),
  noiseGate: z.boolean(),
  compressor: z.boolean(),
  limiter: z.boolean(),
  gain: z.number(),
  eqBands: z.array(eqBandSchema),
});

export const audioMeterSchema = z.object({
  left: z.number(),
  right: z.number(),
});
