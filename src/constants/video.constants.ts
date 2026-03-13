export const VIDEO_VOLUME_RANGE = {
  MIN: 0,
  MAX: 100,
  STEP: 1,
};

export const VIDEO_METER_SEGMENTS = 10;

export const DEFAULT_MIXER_VOLUME = 70;
export const DEFAULT_MIXER_METER = 0;

export const SOURCE_TYPES = {
  CAMERA: "camera",
  SCREEN: "screen",
  VIDEO_FILE: "video-file",
  IMAGE: "image",
  AUDIO_FILE: "audio-file",
  OVERLAY: "overlay",
  LOWER_THIRD: "lower-third",
  COUNTDOWN: "countdown",
  BIBLE_TEXT: "bible-text",
} as const;

export type SourceType = (typeof SOURCE_TYPES)[keyof typeof SOURCE_TYPES];

export const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  [SOURCE_TYPES.CAMERA]: "Camera",
  [SOURCE_TYPES.SCREEN]: "Screen Share",
  [SOURCE_TYPES.VIDEO_FILE]: "Video File",
  [SOURCE_TYPES.IMAGE]: "Image",
  [SOURCE_TYPES.AUDIO_FILE]: "Audio File",
  [SOURCE_TYPES.OVERLAY]: "Overlay Graphics",
  [SOURCE_TYPES.LOWER_THIRD]: "Lower Third",
  [SOURCE_TYPES.COUNTDOWN]: "Countdown Timer",
  [SOURCE_TYPES.BIBLE_TEXT]: "Bible Verse",
};
