import {
  AUDIO_METER_SEGMENTS,
  AUDIO_WAVEFORM_BARS,
} from "@/constants/audio.constants";
import {
  AUDIO_METER_SCALE,
  AUDIO_WAVEFORM_MAX_LEVEL,
} from "@/constants/audio-engine.constants";

export function buildWaveformLevels(
  samples: Uint8Array,
  barCount = AUDIO_WAVEFORM_BARS,
) {
  if (samples.length === 0) {
    return Array.from({ length: barCount }, () => 0);
  }

  const bars: number[] = [];
  const size = Math.max(1, Math.floor(samples.length / barCount));

  for (let index = 0; index < barCount; index += 1) {
    const start = index * size;
    const end = Math.min(samples.length, start + size);
    let total = 0;
    for (let sampleIndex = start; sampleIndex < end; sampleIndex += 1) {
      total += Math.abs(samples[sampleIndex] - 128);
    }
    const average = total / Math.max(1, end - start);
    const normalized = average / 128;
    const level = Math.min(
      AUDIO_WAVEFORM_MAX_LEVEL,
      Math.max(0, Math.round(normalized * AUDIO_WAVEFORM_MAX_LEVEL)),
    );
    bars.push(level);
  }

  return bars;
}

export function calculateRms(samples: Uint8Array) {
  if (samples.length === 0) {
    return 0;
  }
  let sumSquares = 0;
  for (let index = 0; index < samples.length; index += 1) {
    const normalized = (samples[index] - 128) / 128;
    sumSquares += normalized * normalized;
  }
  return Math.sqrt(sumSquares / samples.length);
}

export function mapRmsToMeterLevel(rms: number) {
  const scaled = Math.min(1, rms * AUDIO_METER_SCALE);
  return Math.max(0, Math.round(scaled * AUDIO_METER_SEGMENTS));
}
