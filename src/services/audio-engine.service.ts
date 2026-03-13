import {
  AUDIO_ANALYSER_FFT_SIZE,
  AUDIO_ANALYSER_SMOOTHING,
  AUDIO_COMPRESSOR_BYPASS_SETTINGS,
  AUDIO_COMPRESSOR_SETTINGS,
  AUDIO_EQ_DEFAULT_FREQUENCY,
  AUDIO_EQ_FREQUENCIES,
  AUDIO_GAIN_MULTIPLIER,
  AUDIO_GATE_OPEN_GAIN,
  AUDIO_LATENCY_HINT,
  AUDIO_LIMITER_BYPASS_SETTINGS,
  AUDIO_LIMITER_SETTINGS,
} from "@/constants/audio-engine.constants";
import type { AudioProcessing } from "@/types/audio-studio.types";

export type AudioGraph = {
  context: AudioContext;
  stream: MediaStream;
  source: MediaStreamAudioSourceNode;
  gate: GainNode;
  compressor: DynamicsCompressorNode;
  limiter: DynamicsCompressorNode;
  gain: GainNode;
  analyser: AnalyserNode;
  destination: MediaStreamAudioDestinationNode;
  eqNodes: Record<string, BiquadFilterNode>;
};

export async function createAudioGraph(
  deviceId: string | null,
  noiseSuppression: boolean,
  eqBands: AudioProcessing["eqBands"],
) {
  const constraints: MediaStreamConstraints = {
    audio: {
      deviceId: deviceId ? { exact: deviceId } : undefined,
      noiseSuppression,
      echoCancellation: noiseSuppression,
      autoGainControl: noiseSuppression,
    },
  };

  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  const context = new AudioContext({ latencyHint: AUDIO_LATENCY_HINT });
  await context.resume();

  const source = context.createMediaStreamSource(stream);
  const analyser = context.createAnalyser();
  const gate = context.createGain();
  const compressor = context.createDynamicsCompressor();
  const limiter = context.createDynamicsCompressor();
  const gain = context.createGain();
  const destination = context.createMediaStreamDestination();

  analyser.fftSize = AUDIO_ANALYSER_FFT_SIZE;
  analyser.smoothingTimeConstant = AUDIO_ANALYSER_SMOOTHING;

  const eqNodes: Record<string, BiquadFilterNode> = {};
  let lastNode: AudioNode = gate;
  source.connect(analyser);
  analyser.connect(gate);

  eqBands.forEach((band) => {
    const filter = context.createBiquadFilter();
    filter.type = "peaking";
    filter.frequency.value =
      AUDIO_EQ_FREQUENCIES[band.id] ?? AUDIO_EQ_DEFAULT_FREQUENCY;
    filter.Q.value = 1;
    filter.gain.value = band.gain;
    lastNode.connect(filter);
    lastNode = filter;
    eqNodes[band.id] = filter;
  });

  lastNode.connect(compressor);
  compressor.connect(limiter);
  limiter.connect(gain);
  gain.connect(analyser);
  analyser.connect(destination);

  return {
    context,
    stream,
    source,
    gate,
    compressor,
    limiter,
    gain,
    analyser,
    destination,
    eqNodes,
  } satisfies AudioGraph;
}

export function applyProcessingSettings(
  graph: AudioGraph,
  processing: AudioProcessing,
) {
  graph.gain.gain.value = processing.gain * AUDIO_GAIN_MULTIPLIER;
  if (!processing.noiseGate) {
    graph.gate.gain.value = AUDIO_GATE_OPEN_GAIN;
  }

  const compressorSettings = processing.compressor
    ? AUDIO_COMPRESSOR_SETTINGS
    : AUDIO_COMPRESSOR_BYPASS_SETTINGS;

  graph.compressor.threshold.value = compressorSettings.threshold;
  graph.compressor.knee.value = compressorSettings.knee;
  graph.compressor.ratio.value = compressorSettings.ratio;
  graph.compressor.attack.value = compressorSettings.attack;
  graph.compressor.release.value = compressorSettings.release;

  const limiterSettings = processing.limiter
    ? AUDIO_LIMITER_SETTINGS
    : AUDIO_LIMITER_BYPASS_SETTINGS;

  graph.limiter.threshold.value = limiterSettings.threshold;
  graph.limiter.knee.value = limiterSettings.knee;
  graph.limiter.ratio.value = limiterSettings.ratio;
  graph.limiter.attack.value = limiterSettings.attack;
  graph.limiter.release.value = limiterSettings.release;

  processing.eqBands.forEach((band) => {
    const node = graph.eqNodes[band.id];
    if (node) {
      node.gain.value = band.gain;
    }
  });
}

export async function applyNoiseSuppression(
  stream: MediaStream,
  enabled: boolean,
) {
  const [track] = stream.getAudioTracks();
  if (!track?.applyConstraints) {
    return;
  }

  try {
    await track.applyConstraints({
      noiseSuppression: enabled,
      echoCancellation: enabled,
      autoGainControl: enabled,
    });
  } catch {}
}

export async function destroyAudioGraph(graph: AudioGraph | null) {
  if (!graph) {
    return;
  }
  graph.stream.getTracks().forEach((track) => {
    track.stop();
  });
  await graph.context.close();
}
