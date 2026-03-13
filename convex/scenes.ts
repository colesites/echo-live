import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { requireStreamOwner } from "./utils";

const DEFAULT_ORDER = 1;

export const listScenesByStream = query({
  args: { streamId: v.id("streams") },
  handler: async (ctx, args) => {
    await requireStreamOwner(ctx, args.streamId);
    return ctx.db
      .query("scenes")
      .withIndex("by_stream", (query) => query.eq("streamId", args.streamId))
      .order("asc")
      .collect();
  },
});

export const addScene = mutation({
  args: {
    streamId: v.id("streams"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    await requireStreamOwner(ctx, args.streamId);
    return ctx.db.insert("scenes", {
      streamId: args.streamId,
      name: args.name,
      sources: [],
      order: DEFAULT_ORDER,
      createdAt: Date.now(),
    });
  },
});
