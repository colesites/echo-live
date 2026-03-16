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

export const updateStreamDetails = mutation({
  args: {
    streamId: v.id("streams"),
    title: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { stream } = await requireStreamOwner(ctx, args.streamId);
    const updates: Partial<typeof stream> = {};

    if (args.title !== undefined) {
      updates.title = args.title;
    }

    if (args.imageUrl !== undefined) {
      updates.imageUrl = args.imageUrl;
    }

    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(stream._id, updates);
    }

    return stream._id;
  },
});
