export const STREAM_MODE = {
  AUDIO: "audio",
  VIDEO: "video",
} as const;

export type StreamMode = (typeof STREAM_MODE)[keyof typeof STREAM_MODE];

export const STREAM_STATUS = {
  SCHEDULED: "scheduled",
  LIVE: "live",
  ENDED: "ended",
} as const;

export type StreamStatus = (typeof STREAM_STATUS)[keyof typeof STREAM_STATUS];

export const STREAM_TYPE_LABELS: Record<StreamMode, string> = {
  [STREAM_MODE.AUDIO]: "Audio",
  [STREAM_MODE.VIDEO]: "Video",
};

export const STREAM_STATUS_LABELS: Record<StreamStatus, string> = {
  [STREAM_STATUS.SCHEDULED]: "Scheduled",
  [STREAM_STATUS.LIVE]: "Live",
  [STREAM_STATUS.ENDED]: "Ended",
};
