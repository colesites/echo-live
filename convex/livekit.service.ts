import {
  EgressClient,
  S3Upload,
  SegmentedFileOutput,
  SegmentedFileProtocol,
} from "livekit-server-sdk";

import {
  LIVEKIT_CONFIG_ERROR_MESSAGE,
  LIVEKIT_EGRESS_CONFIG_ERROR_MESSAGE,
  LIVEKIT_EGRESS_LIVE_PLAYLIST,
  LIVEKIT_EGRESS_PLAYLIST,
  LIVEKIT_EGRESS_PREFIX,
} from "./livekit.constants";

const HTTP_PREFIX = "http://";
const HTTPS_PREFIX = "https://";
const WS_PREFIX = "ws://";
const WSS_PREFIX = "wss://";
const LIVEKIT_S3_FORCE_PATH_STYLE = "true";

export type LiveKitConfig = {
  livekitUrl: string;
  apiKey: string;
  apiSecret: string;
};

export type S3Config = {
  accessKey: string;
  secret: string;
  region: string;
  bucket: string;
  endpoint?: string;
  publicBaseUrl: string;
  forcePathStyle: boolean;
};

export function resolveLiveKitHost(url: string) {
  if (url.startsWith(WSS_PREFIX)) {
    return `${HTTPS_PREFIX}${url.slice(WSS_PREFIX.length)}`;
  }
  if (url.startsWith(WS_PREFIX)) {
    return `${HTTP_PREFIX}${url.slice(WS_PREFIX.length)}`;
  }
  return url;
}

export function getLiveKitConfig(): LiveKitConfig {
  const livekitUrl = process.env.LIVEKIT_URL;
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!livekitUrl || !apiKey || !apiSecret) {
    throw new Error(LIVEKIT_CONFIG_ERROR_MESSAGE);
  }

  return {
    livekitUrl,
    apiKey,
    apiSecret,
  };
}

export function getS3Config(): S3Config {
  const accessKey = process.env.LIVEKIT_S3_ACCESS_KEY;
  const secret = process.env.LIVEKIT_S3_SECRET;
  const region = process.env.LIVEKIT_S3_REGION;
  const bucket = process.env.LIVEKIT_S3_BUCKET;
  const endpoint = process.env.LIVEKIT_S3_ENDPOINT;
  const publicBaseUrl = process.env.LIVEKIT_S3_PUBLIC_BASE_URL;
  const forcePathStyle =
    process.env.LIVEKIT_S3_FORCE_PATH_STYLE === LIVEKIT_S3_FORCE_PATH_STYLE;

  if (!accessKey || !secret || !region || !bucket || !publicBaseUrl) {
    throw new Error(LIVEKIT_EGRESS_CONFIG_ERROR_MESSAGE);
  }

  return {
    accessKey,
    secret,
    region,
    bucket,
    endpoint: endpoint || undefined,
    publicBaseUrl,
    forcePathStyle,
  };
}

export function createEgressClient(config: LiveKitConfig) {
  return new EgressClient(
    resolveLiveKitHost(config.livekitUrl),
    config.apiKey,
    config.apiSecret,
  );
}

export function buildAudioEgressOutput(config: S3Config, publicId: string) {
  const now = Date.now();
  const prefix = `${LIVEKIT_EGRESS_PREFIX}/${publicId}/${now}`;
  const playlistPath = `${prefix}/${LIVEKIT_EGRESS_PLAYLIST}`;
  const livePlaylistPath = `${prefix}/${LIVEKIT_EGRESS_LIVE_PLAYLIST}`;

  const s3Output = new S3Upload({
    accessKey: config.accessKey,
    secret: config.secret,
    region: config.region,
    bucket: config.bucket,
    endpoint: config.endpoint ?? "",
    forcePathStyle: config.forcePathStyle,
  });

  const output = new SegmentedFileOutput({
    protocol: SegmentedFileProtocol.HLS,
    filenamePrefix: prefix,
    playlistName: playlistPath,
    livePlaylistName: livePlaylistPath,
    segmentDuration: 2,
    output: {
      case: "s3",
      value: s3Output,
    },
  });

  return { output, prefix, playlistPath, livePlaylistPath };
}

export function buildAudioUrl(baseUrl: string, playlistPath: string) {
  const normalized = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  return `${normalized}/${playlistPath}`;
}
