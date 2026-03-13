import { z } from "zod";

import { DESTINATION_PLATFORMS } from "@/constants/destination.constants";

export const destinationFormSchema = z.object({
  platform: z.enum([
    DESTINATION_PLATFORMS.YOUTUBE,
    DESTINATION_PLATFORMS.FACEBOOK,
    DESTINATION_PLATFORMS.TWITCH,
    DESTINATION_PLATFORMS.CUSTOM,
  ]),
  rtmpUrl: z.string().min(6, "RTMP URL is required."),
  streamKey: z.string().min(6, "Stream key is required."),
});
