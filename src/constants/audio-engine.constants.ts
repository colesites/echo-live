import { AUDIO_EQ_BANDS, AUDIO_GAIN_RANGE } from "@/constants/audio.constants";

export const AUDIO_LATENCY_HINT = "interactive";

export const AUDIO_ANALYSER_FFT_SIZE = 2048;
export const AUDIO_ANALYSER_SMOOTHING = 0.8;

export const AUDIO_GATE_THRESHOLD = 0.04;
export const AUDIO_GATE_OPEN_GAIN = 1;
export const AUDIO_GATE_CLOSED_GAIN = 0;
export const AUDIO_GATE_SMOOTHING = 0.08;

export const AUDIO_METER_SCALE = 1.6;
export const AUDIO_WAVEFORM_MAX_LEVEL = 6;

export const AUDIO_COMPRESSOR_SETTINGS = {
  threshold: -18,
  knee: 18,
  ratio: 6,
  attack: 0.003,
  release: 0.25,
};

export const AUDIO_LIMITER_SETTINGS = {
  threshold: -3,
  knee: 0,
  ratio: 20,
  attack: 0.001,
  release: 0.2,
};

export const AUDIO_COMPRESSOR_BYPASS_SETTINGS = {
  threshold: 0,
  knee: 0,
  ratio: 1,
  attack: 0,
  release: 0,
};

export const AUDIO_LIMITER_BYPASS_SETTINGS = {
  threshold: 0,
  knee: 0,
  ratio: 1,
  attack: 0,
  release: 0,
};

export const AUDIO_GAIN_MULTIPLIER = 1 / AUDIO_GAIN_RANGE.MAX;

export const AUDIO_EQ_FREQUENCIES = AUDIO_EQ_BANDS.reduce(
  (accumulator, band) => {
    const frequency = Number(band.id);
    if (!Number.isNaN(frequency)) {
      accumulator[band.id] = frequency;
    }
    return accumulator;
  },
  {} as Record<string, number>,
);

export const AUDIO_EQ_DEFAULT_FREQUENCY = 1000;

export const AUDIO_VISUALIZER_SAMPLE_COUNT = 256;
