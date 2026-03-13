export const STREAM_TYPES = {
  AUDIO: "audio",
  VIDEO: "video",
} as const;

export const STREAM_STATUSES = {
  SCHEDULED: "scheduled",
  LIVE: "live",
  ENDED: "ended",
} as const;

export const DESTINATION_PLATFORMS = {
  YOUTUBE: "youtube",
  FACEBOOK: "facebook",
  TWITCH: "twitch",
  CUSTOM: "custom",
} as const;

export const STREAM_KEY_LENGTH = 24;
export const PUBLIC_ID_LENGTH = 10;
