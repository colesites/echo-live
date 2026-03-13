import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { DESTINATION_PLATFORMS } from "./shared";
import { requireStreamOwner } from "./utils";

export const listDestinationsByStream = query({
  args: { streamId: v.id("streams") },
  handler: async (ctx, args) => {
    await requireStreamOwner(ctx, args.streamId);
    return ctx.db
      .query("destinations")
      .withIndex("by_stream", (query) => query.eq("streamId", args.streamId))
      .collect();
  },
});

export const addDestination = mutation({
  args: {
    streamId: v.id("streams"),
    platform: v.union(
      v.literal(DESTINATION_PLATFORMS.YOUTUBE),
      v.literal(DESTINATION_PLATFORMS.FACEBOOK),
      v.literal(DESTINATION_PLATFORMS.TWITCH),
      v.literal(DESTINATION_PLATFORMS.CUSTOM),
    ),
    rtmpUrl: v.string(),
    streamKey: v.string(),
  },
  handler: async (ctx, args) => {
    await requireStreamOwner(ctx, args.streamId);
    return ctx.db.insert("destinations", {
      streamId: args.streamId,
      platform: args.platform,
      rtmpUrl: args.rtmpUrl,
      streamKey: args.streamKey,
      enabled: true,
      createdAt: Date.now(),
    });
  },
});

export const toggleDestination = mutation({
  args: {
    destinationId: v.id("destinations"),
    enabled: v.boolean(),
  },
  handler: async (ctx, args) => {
    const destination = await ctx.db.get(args.destinationId);
    if (!destination) {
      throw new Error("Destination not found.");
    }
    await requireStreamOwner(ctx, destination.streamId);
    await ctx.db.patch(args.destinationId, { enabled: args.enabled });
    return args.destinationId;
  },
});

export const removeDestination = mutation({
  args: { destinationId: v.id("destinations") },
  handler: async (ctx, args) => {
    const destination = await ctx.db.get(args.destinationId);
    if (!destination) {
      throw new Error("Destination not found.");
    }
    await requireStreamOwner(ctx, destination.streamId);
    await ctx.db.delete(args.destinationId);
    return args.destinationId;
  },
});
