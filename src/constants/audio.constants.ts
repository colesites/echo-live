export const AUDIO_EQ_BANDS = [
  { id: "32", label: "32 Hz" },
  { id: "64", label: "64 Hz" },
  { id: "125", label: "125 Hz" },
  { id: "250", label: "250 Hz" },
  { id: "500", label: "500 Hz" },
  { id: "1k", label: "1 kHz" },
  { id: "2k", label: "2 kHz" },
  { id: "4k", label: "4 kHz" },
  { id: "8k", label: "8 kHz" },
  { id: "16k", label: "16 kHz" },
];

export const AUDIO_GAIN_RANGE = {
  MIN: 0,
  MAX: 100,
  STEP: 1,
};

export const AUDIO_EQ_RANGE = {
  MIN: -12,
  MAX: 12,
  STEP: 1,
};

export const AUDIO_METER_SEGMENTS = 12;

export const AUDIO_WAVEFORM_BARS = 18;

export const DEFAULT_EQ_GAINS = [2, 1, 0, -1, -2, -1, 0, 1, 2, 3];

export const DEFAULT_AUDIO_GAIN = 62;

export const DEFAULT_AUDIO_METERS = {
  left: 0,
  right: 0,
};

export const AUDIO_PLAYBACK_ERROR_MESSAGE =
  "Unable to start audio playback. Please try again.";

export const DEFAULT_MIC_LABEL = "Default Microphone";
export const MICROPHONE_PERMISSION_ERROR_MESSAGE =
  "Microphone access is required to continue.";
export const MICROPHONE_ENUMERATION_ERROR_MESSAGE =
  "Unable to load microphones.";
export const MICROPHONE_ACCESS_ERROR_MESSAGE =
  "Unable to access the microphone.";
