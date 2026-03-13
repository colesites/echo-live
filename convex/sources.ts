import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { requireStreamOwner } from "./utils";

const DEFAULT_POSITION = { x: 0, y: 0 };
const DEFAULT_SIZE = { width: 1280, height: 720 };
const DEFAULT_Z_INDEX = 1;

export const listSourcesByStream = query({
  args: { streamId: v.id("streams") },
  handler: async (ctx, args) => {
    await requireStreamOwner(ctx, args.streamId);
    return ctx.db
      .query("sources")
      .withIndex("by_stream", (query) => query.eq("streamId", args.streamId))
      .collect();
  },
});

export const addSource = mutation({
  args: {
    streamId: v.id("streams"),
    name: v.string(),
    type: v.string(),
    config: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireStreamOwner(ctx, args.streamId);
    return ctx.db.insert("sources", {
      streamId: args.streamId,
      name: args.name,
      type: args.type,
      config: args.config,
      position: DEFAULT_POSITION,
      size: DEFAULT_SIZE,
      zIndex: DEFAULT_Z_INDEX,
      createdAt: Date.now(),
    });
  },
});
