"use client";

import Hls from "hls.js";
import type { RefObject } from "react";
import { useEffect } from "react";

const HLS_MIME_TYPE = "application/vnd.apple.mpegurl";

type MediaElement = HTMLVideoElement | HTMLAudioElement;

export type UseHlsProps = {
  mediaRef: RefObject<MediaElement | null>;
  src?: string | null;
};

export function useHls({ mediaRef, src }: UseHlsProps) {
  useEffect(() => {
    const media = mediaRef.current;
    if (!media || !src) {
      return;
    }

    if (media.canPlayType(HLS_MIME_TYPE)) {
      media.src = src;
      return;
    }

    if (!Hls.isSupported()) {
      media.src = src;
      return;
    }

    const hls = new Hls({
      lowLatencyMode: true,
      liveSyncDuration: 3,
      liveMaxLatencyDuration: 10,
      maxBufferLength: 10,
      maxMaxBufferLength: 20,
      backBufferLength: 0,
    });
    hls.loadSource(src);
    hls.attachMedia(media);

    return () => {
      hls.destroy();
    };
  }, [mediaRef, src]);
}
