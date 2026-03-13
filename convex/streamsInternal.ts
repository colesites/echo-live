import { v } from "convex/values";

import { internalMutation } from "./_generated/server";

export const updateAudioEgress = internalMutation({
  args: {
    publicId: v.string(),
    audioUrl: v.optional(v.string()),
    audioEgressId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const stream = await ctx.db
      .query("streams")
      .withIndex("by_public_id", (query) => query.eq("publicId", args.publicId))
      .unique();

    if (!stream) {
      return null;
    }

    await ctx.db.patch(stream._id, {
      audioUrl: args.audioUrl,
      audioEgressId: args.audioEgressId,
    });

    return stream._id;
  },
});
