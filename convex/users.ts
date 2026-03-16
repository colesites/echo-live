import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { AUTH_ERROR_MESSAGE, getUserByClerkId, requireUser } from "./utils";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const { user } = await requireUser(ctx);
    return user;
  },
});

export const upsertCurrentUser = mutation({
  args: {
    churchName: v.string(),
    logo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) {
        throw new Error(AUTH_ERROR_MESSAGE);
      }

      const existing = await getUserByClerkId(ctx, identity.subject);

      if (existing) {
        await ctx.db.patch(existing._id, {
          churchName: args.churchName,
          logo: args.logo,
        });
        return existing._id;
      }

      return ctx.db.insert("users", {
        clerkId: identity.subject,
        churchName: args.churchName,
        logo: args.logo,
        createdAt: Date.now(),
      });
    } catch (error) {
      throw error instanceof Error ? error : new Error(AUTH_ERROR_MESSAGE);
    }
  },
});

export const updateUserLogo = mutation({
  args: {
    logo: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const { user } = await requireUser(ctx);
      await ctx.db.patch(user._id, {
        logo: args.logo,
      });
      return user._id;
    } catch (error) {
      throw error instanceof Error ? error : new Error(AUTH_ERROR_MESSAGE);
    }
  },
});
