"use client";

import { api } from "@convex/_generated/api";
import { useAction } from "convex/react";
import { LocalAudioTrack, Room } from "livekit-client";
import { useEffect, useRef, useState } from "react";

import {
  LIVEKIT_AUDIO_TRACK_NAME,
  LIVEKIT_CONNECTION_ERROR_MESSAGE,
  LIVEKIT_PUBLISH_ERROR_MESSAGE,
} from "@/constants/livekit.constants";
import {
  livekitEgressSchema,
  livekitTokenSchema,
} from "@/lib/schemas/livekit.schema";

type UseLiveKitAudioPublisherProps = {
  streamId: string;
  isLive: boolean;
  output: MediaStream | null;
};

type LiveKitState = {
  isConnecting: boolean;
  error: string | null;
};

export function useLiveKitAudioPublisher({
  streamId,
  isLive,
  output,
}: UseLiveKitAudioPublisherProps) {
  const createToken = useAction(api.livekit.createAudioToken);
  const startEgress = useAction(api.livekit.startAudioEgress);
  const stopEgress = useAction(api.livekit.stopAudioEgress);
  const [state, setState] = useState<LiveKitState>({
    isConnecting: false,
    error: null,
  });
  const roomRef = useRef<Room | null>(null);
  const trackRef = useRef<LocalAudioTrack | null>(null);
  const egressRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isLive || !output) {
      if (trackRef.current) {
        trackRef.current.stop();
        trackRef.current = null;
      }
      if (roomRef.current) {
        void roomRef.current.disconnect();
        roomRef.current = null;
      }
      if (egressRef.current) {
        void stopEgress({ streamId });
        egressRef.current = null;
      }
      return;
    }

    if (roomRef.current && trackRef.current && egressRef.current) {
      return;
    }

    let isMounted = true;

    const connect = async () => {
      setState({ isConnecting: true, error: null });
      try {
        const response = await createToken({ streamId });
        const parsed = livekitTokenSchema.safeParse(response);
        if (!parsed.success) {
          throw new Error(LIVEKIT_CONNECTION_ERROR_MESSAGE);
        }

        const room = new Room({ adaptiveStream: true, dynacast: true });
        await room.connect(parsed.data.url, parsed.data.token);

        const [track] = output.getAudioTracks();
        if (!track) {
          throw new Error(LIVEKIT_PUBLISH_ERROR_MESSAGE);
        }

        const localTrack = new LocalAudioTrack(track);
        await room.localParticipant.publishTrack(localTrack, {
          name: LIVEKIT_AUDIO_TRACK_NAME,
        });

        if (!isMounted) {
          localTrack.stop();
          await room.disconnect();
          return;
        }

        roomRef.current = room;
        trackRef.current = localTrack;
        const egressResponse = await startEgress({ streamId });
        const parsedEgress = livekitEgressSchema.safeParse(egressResponse);
        if (!parsedEgress.success) {
          throw new Error(LIVEKIT_CONNECTION_ERROR_MESSAGE);
        }
        egressRef.current = parsedEgress.data.egressId;
        setState({ isConnecting: false, error: null });
      } catch (_error) {
        if (isMounted) {
          setState({
            isConnecting: false,
            error: LIVEKIT_CONNECTION_ERROR_MESSAGE,
          });
        }
      }
    };

    void connect();

    return () => {
      isMounted = false;
      if (trackRef.current) {
        trackRef.current.stop();
        trackRef.current = null;
      }
      if (roomRef.current) {
        void roomRef.current.disconnect();
        roomRef.current = null;
      }
    };
  }, [createToken, isLive, output, startEgress, stopEgress, streamId]);

  return state;
}
