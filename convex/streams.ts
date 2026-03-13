import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { STREAM_STATUSES, STREAM_TYPES } from "./shared";
import { buildPublicId, buildRtmpKey } from "./stream.utils";
import { requireStreamOwner, requireUser } from "./utils";

export const createStream = mutation({
  args: {
    title: v.string(),
    type: v.union(v.literal(STREAM_TYPES.AUDIO), v.literal(STREAM_TYPES.VIDEO)),
    scheduledFor: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { user } = await requireUser(ctx);

    const streamId = await ctx.db.insert("streams", {
      publicId: buildPublicId(),
      title: args.title,
      type: args.type,
      status: STREAM_STATUSES.SCHEDULED,
      ownerId: user._id,
      rtmpKey: buildRtmpKey(),
      scheduledFor: args.scheduledFor,
      createdAt: Date.now(),
    });

    return streamId;
  },
});

export const getStreamById = query({
  args: { streamId: v.id("streams") },
  handler: async (ctx, args) => {
    await requireStreamOwner(ctx, args.streamId);
    return ctx.db.get(args.streamId);
  },
});

export const getStreamByPublicId = query({
  args: { publicId: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("streams")
      .withIndex("by_public_id", (query) => query.eq("publicId", args.publicId))
      .unique();
  },
});

export const listStreamsByOwner = query({
  args: {},
  handler: async (ctx) => {
    const { user } = await requireUser(ctx);
    return ctx.db
      .query("streams")
      .withIndex("by_owner", (query) => query.eq("ownerId", user._id))
      .order("desc")
      .collect();
  },
});

export const updateStreamStatus = mutation({
  args: {
    streamId: v.id("streams"),
    status: v.union(
      v.literal(STREAM_STATUSES.SCHEDULED),
      v.literal(STREAM_STATUSES.LIVE),
      v.literal(STREAM_STATUSES.ENDED),
    ),
  },
  handler: async (ctx, args) => {
    const { stream } = await requireStreamOwner(ctx, args.streamId);
    const now = Date.now();
    const updates: Partial<typeof stream> = {
      status: args.status,
    };

    if (args.status === STREAM_STATUSES.LIVE) {
      updates.liveStartedAt = now;
    }

    if (args.status === STREAM_STATUSES.ENDED) {
      updates.endedAt = now;
    }

    await ctx.db.patch(stream._id, updates);

    if (args.status === STREAM_STATUSES.ENDED) {
      const existing = await ctx.db
        .query("recordings")
        .withIndex("by_stream", (query) => query.eq("streamId", stream._id))
        .collect();
      const recordingUrl =
        stream.type === STREAM_TYPES.AUDIO ? stream.audioUrl : stream.hlsUrl;
      if (!existing.length && recordingUrl) {
        const durationSeconds = Math.max(
          0,
          Math.round((now - (stream.liveStartedAt ?? now)) / 1000),
        );
        await ctx.db.insert("recordings", {
          streamId: stream._id,
          type: stream.type,
          url: recordingUrl,
          downloadUrl: recordingUrl,
          durationSeconds,
          createdAt: now,
        });
      }
    }

    return stream._id;
  },
});

export const deleteStream = mutation({
  args: { streamId: v.id("streams") },
  handler: async (ctx, args) => {
    await requireStreamOwner(ctx, args.streamId);
    await ctx.db.delete(args.streamId);
    return args.streamId;
  },
});
