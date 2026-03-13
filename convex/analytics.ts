import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { STREAM_TYPES } from "./shared";
import { requireStreamOwner } from "./utils";

const UNKNOWN_COUNTRY = "Unknown";

export const trackView = mutation({
  args: {
    publicId: v.string(),
    country: v.optional(v.string()),
    watchDurationSeconds: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const stream = await ctx.db
      .query("streams")
      .withIndex("by_public_id", (query) => query.eq("publicId", args.publicId))
      .unique();

    if (!stream) {
      throw new Error("Stream not found.");
    }

    const isAudio = stream.type === STREAM_TYPES.AUDIO;
    const isVideo = stream.type === STREAM_TYPES.VIDEO;

    return ctx.db.insert("analytics", {
      streamId: stream._id,
      viewerCount: isVideo ? 1 : 0,
      listenerCount: isAudio ? 1 : 0,
      country: args.country ?? UNKNOWN_COUNTRY,
      watchDurationSeconds: args.watchDurationSeconds ?? 0,
      recordedAt: Date.now(),
    });
  },
});

export const getSummaryByStream = query({
  args: { streamId: v.id("streams") },
  handler: async (ctx, args) => {
    await requireStreamOwner(ctx, args.streamId);
    const entries = await ctx.db
      .query("analytics")
      .withIndex("by_stream", (query) => query.eq("streamId", args.streamId))
      .collect();

    const totals = entries.reduce(
      (acc, entry) => {
        acc.totalViewers += entry.viewerCount;
        acc.totalListeners += entry.listenerCount;
        acc.totalWatchDuration += entry.watchDurationSeconds;
        acc.peakViewers = Math.max(acc.peakViewers, entry.viewerCount);
        acc.peakListeners = Math.max(acc.peakListeners, entry.listenerCount);
        return acc;
      },
      {
        totalViewers: 0,
        totalListeners: 0,
        totalWatchDuration: 0,
        peakViewers: 0,
        peakListeners: 0,
      },
    );

    const averageWatchDuration = entries.length
      ? Math.round(totals.totalWatchDuration / entries.length)
      : 0;

    return {
      totalViewers: totals.totalViewers,
      totalListeners: totals.totalListeners,
      peakViewers: totals.peakViewers,
      peakListeners: totals.peakListeners,
      averageWatchDuration,
    };
  },
});

export const getTimeSeriesByStream = query({
  args: { streamId: v.id("streams") },
  handler: async (ctx, args) => {
    await requireStreamOwner(ctx, args.streamId);
    return ctx.db
      .query("analytics")
      .withIndex("by_stream", (query) => query.eq("streamId", args.streamId))
      .order("asc")
      .collect();
  },
});

export const getCountryBreakdownByStream = query({
  args: { streamId: v.id("streams") },
  handler: async (ctx, args) => {
    await requireStreamOwner(ctx, args.streamId);
    const entries = await ctx.db
      .query("analytics")
      .withIndex("by_stream", (query) => query.eq("streamId", args.streamId))
      .collect();

    const counts = entries.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.country] = (acc[entry.country] ?? 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([country, count]) => ({
      country,
      count,
    }));
  },
});
