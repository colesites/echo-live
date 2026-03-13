import { v } from "convex/values";

import { query } from "./_generated/server";

export const getPublicSummaryByPublicId = query({
  args: { publicId: v.string() },
  handler: async (ctx, args) => {
    const stream = await ctx.db
      .query("streams")
      .withIndex("by_public_id", (query) => query.eq("publicId", args.publicId))
      .unique();

    if (!stream) {
      return null;
    }

    const entries = await ctx.db
      .query("analytics")
      .withIndex("by_stream", (query) => query.eq("streamId", stream._id))
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
