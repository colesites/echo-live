export const DESTINATION_PLATFORMS = {
  YOUTUBE: "youtube",
  FACEBOOK: "facebook",
  TWITCH: "twitch",
  CUSTOM: "custom",
} as const;

export type DestinationPlatform =
  (typeof DESTINATION_PLATFORMS)[keyof typeof DESTINATION_PLATFORMS];

export const DESTINATION_LABELS: Record<DestinationPlatform, string> = {
  [DESTINATION_PLATFORMS.YOUTUBE]: "YouTube Live",
  [DESTINATION_PLATFORMS.FACEBOOK]: "Facebook Live",
  [DESTINATION_PLATFORMS.TWITCH]: "Twitch",
  [DESTINATION_PLATFORMS.CUSTOM]: "Custom RTMP",
};
