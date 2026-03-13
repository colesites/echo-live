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

    const owner = await ctx.db.get(stream.ownerId);

    return {
      stream,
      owner: owner
        ? { churchName: owner.churchName, logo: owner.logo ?? null }
        : null,
    };
  },
});
