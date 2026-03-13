import { v } from "convex/values";

import { mutation } from "./_generated/server";
import { requireStreamOwner } from "./utils";

export const updateStreamLinks = mutation({
  args: {
    streamId: v.id("streams"),
    hlsUrl: v.optional(v.string()),
    audioUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { stream } = await requireStreamOwner(ctx, args.streamId);
    await ctx.db.patch(stream._id, {
      hlsUrl: args.hlsUrl,
      audioUrl: args.audioUrl,
    });
    return stream._id;
  },
});

export const updateStreamSchedule = mutation({
  args: {
    streamId: v.id("streams"),
    scheduledFor: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { stream } = await requireStreamOwner(ctx, args.streamId);
    await ctx.db.patch(stream._id, {
      scheduledFor: args.scheduledFor,
    });
    return stream._id;
  },
});
