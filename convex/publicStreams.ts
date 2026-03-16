import { v } from "convex/values";

import { query } from "./_generated/server";

export const getPublicStreamDetails = query({
  args: { publicId: v.string() },
  handler: async (ctx, args) => {
    const stream = await ctx.db
      .query("streams")
      .withIndex("by_public_id", (query) => query.eq("publicId", args.publicId))
      .unique();

    if (!stream) {
      return null;
    }

    return {
      stream,
      org: stream.orgName
        ? { name: stream.orgName, imageUrl: stream.orgImageUrl ?? null }
        : null,
    };
  },
});
