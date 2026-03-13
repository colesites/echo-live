import type { z } from "zod";

import type {
  audioMeterSchema,
  audioProcessingSchema,
  eqBandSchema,
} from "@/lib/schemas/audio-studio.schema";

export type AudioEqBand = z.infer<typeof eqBandSchema>;
export type AudioProcessing = z.infer<typeof audioProcessingSchema>;
export type AudioMeterLevels = z.infer<typeof audioMeterSchema>;
