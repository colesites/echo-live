import { z } from "zod";

import { DESTINATION_PLATFORMS } from "@/constants/destination.constants";

export const destinationSchema = z.object({
  id: z.string(),
  streamId: z.string(),
  platform: z.enum([
    DESTINATION_PLATFORMS.YOUTUBE,
    DESTINATION_PLATFORMS.FACEBOOK,
    DESTINATION_PLATFORMS.TWITCH,
    DESTINATION_PLATFORMS.CUSTOM,
  ]),
  rtmpUrl: z.string(),
  streamKey: z.string(),
  enabled: z.boolean(),
  createdAt: z.number(),
});

export const destinationListSchema = z.array(destinationSchema);
