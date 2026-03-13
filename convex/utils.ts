import type { Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";

export const AUTH_ERROR_MESSAGE = "Authentication required.";
export const USER_NOT_FOUND_MESSAGE = "User not found.";
export const STREAM_NOT_FOUND_MESSAGE = "Stream not found.";

export type AuthedContext = QueryCtx | MutationCtx;

export async function getUserByClerkId(ctx: AuthedContext, clerkId: string) {
  return ctx.db
    .query("users")
    .withIndex("by_clerk_id", (query) => query.eq("clerkId", clerkId))
    .unique();
}

export async function requireUser(ctx: AuthedContext) {
  try {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error(AUTH_ERROR_MESSAGE);
    }
    const user = await getUserByClerkId(ctx, identity.subject);
    if (!user) {
      throw new Error(USER_NOT_FOUND_MESSAGE);
    }
    return { identity, user };
  } catch (error) {
    throw error instanceof Error ? error : new Error(AUTH_ERROR_MESSAGE);
  }
}

export async function requireStreamOwner(
  ctx: AuthedContext,
  streamId: Id<"streams">,
) {
  const { user } = await requireUser(ctx);
  const stream = await ctx.db.get(streamId);
  if (!stream) {
    throw new Error(STREAM_NOT_FOUND_MESSAGE);
  }
  if (stream.ownerId !== user._id) {
    throw new Error(AUTH_ERROR_MESSAGE);
  }
  return { stream, user };
}
