import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { STREAM_TYPES } from "./shared";
import { requireStreamOwner, requireUser } from "./utils";

export const addRecording = mutation({
  args: {
    streamId: v.id("streams"),
    type: v.union(v.literal(STREAM_TYPES.AUDIO), v.literal(STREAM_TYPES.VIDEO)),
    url: v.string(),
    downloadUrl: v.optional(v.string()),
    durationSeconds: v.number(),
  },
  handler: async (ctx, args) => {
    await requireStreamOwner(ctx, args.streamId);
    return ctx.db.insert("recordings", {
      streamId: args.streamId,
      type: args.type,
      url: args.url,
      downloadUrl: args.downloadUrl,
      durationSeconds: args.durationSeconds,
      createdAt: Date.now(),
    });
  },
});

export const listRecordingsByStream = query({
  args: { streamId: v.id("streams") },
  handler: async (ctx, args) => {
    await requireStreamOwner(ctx, args.streamId);
    return ctx.db
      .query("recordings")
      .withIndex("by_stream", (query) => query.eq("streamId", args.streamId))
      .order("desc")
      .collect();
  },
});

export const listRecordingsByOwner = query({
  args: {},
  handler: async (ctx) => {
    const { user } = await requireUser(ctx);
    const streams = await ctx.db
      .query("streams")
      .withIndex("by_owner", (query) => query.eq("ownerId", user._id))
      .collect();

    const streamIds = streams.map((stream) => stream._id);
    const recordings = await Promise.all(
      streamIds.map((streamId) =>
        ctx.db
          .query("recordings")
          .withIndex("by_stream", (query) => query.eq("streamId", streamId))
          .collect(),
      ),
    );

    return recordings
      .flat()
      .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
  },
});
