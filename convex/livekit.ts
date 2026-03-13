"use node";

import { v } from "convex/values";
import { AccessToken } from "livekit-server-sdk";

import { api, internal } from "./_generated/api";
import { action } from "./_generated/server";
import { LIVEKIT_ROOM_PREFIX } from "./livekit.constants";
import {
  buildAudioEgressOutput,
  buildAudioUrl,
  createEgressClient,
  getLiveKitConfig,
  getS3Config,
} from "./livekit.service";
import { AUTH_ERROR_MESSAGE, STREAM_NOT_FOUND_MESSAGE } from "./utils";

export const createAudioToken = action({
  args: {
    streamId: v.id("streams"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error(AUTH_ERROR_MESSAGE);
    }

    const stream = await ctx.runQuery(api.streams.getStreamById, {
      streamId: args.streamId,
    });
    if (!stream) {
      throw new Error(STREAM_NOT_FOUND_MESSAGE);
    }

    const { livekitUrl, apiKey, apiSecret } = getLiveKitConfig();

    const room = `${LIVEKIT_ROOM_PREFIX}${stream.publicId}`;
    const token = new AccessToken(apiKey, apiSecret, {
      identity: identity.subject,
      name: identity.name ?? undefined,
    });
    token.addGrant({
      room,
      roomJoin: true,
      canPublish: true,
      canSubscribe: false,
    });

    const jwt = await token.toJwt();

    return {
      token: jwt,
      url: livekitUrl,
      room,
    };
  },
});

export const startAudioEgress = action({
  args: {
    streamId: v.id("streams"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error(AUTH_ERROR_MESSAGE);
    }

    const stream = await ctx.runQuery(api.streams.getStreamById, {
      streamId: args.streamId,
    });
    if (!stream) {
      throw new Error(STREAM_NOT_FOUND_MESSAGE);
    }

    const livekitConfig = getLiveKitConfig();
    const s3Config = getS3Config();
    const egressClient = createEgressClient(livekitConfig);
    const { output, livePlaylistPath } = buildAudioEgressOutput(
      s3Config,
      stream.publicId,
    );

    const room = `${LIVEKIT_ROOM_PREFIX}${stream.publicId}`;
    const egress = await egressClient.startRoomCompositeEgress(room, output, {
      audioOnly: true,
    });

    const audioUrl = buildAudioUrl(s3Config.publicBaseUrl, livePlaylistPath);

    await ctx.runMutation(internal.streamsInternal.updateAudioEgress, {
      publicId: stream.publicId,
      audioUrl,
      audioEgressId: egress.egressId,
    });

    return {
      egressId: egress.egressId,
      audioUrl,
    };
  },
});

export const stopAudioEgress = action({
  args: {
    streamId: v.id("streams"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error(AUTH_ERROR_MESSAGE);
    }

    const stream = await ctx.runQuery(api.streams.getStreamById, {
      streamId: args.streamId,
    });
    if (!stream?.audioEgressId) {
      return null;
    }

    const livekitConfig = getLiveKitConfig();
    const egressClient = createEgressClient(livekitConfig);
    await egressClient.stopEgress(stream.audioEgressId);

    await ctx.runMutation(internal.streamsInternal.updateAudioEgress, {
      publicId: stream.publicId,
      audioEgressId: undefined,
    });

    return stream.audioEgressId;
  },
});
