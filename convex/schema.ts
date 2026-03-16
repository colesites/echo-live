import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

import { DESTINATION_PLATFORMS, STREAM_STATUSES, STREAM_TYPES } from "./shared";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    churchName: v.string(),
    logo: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),
  streams: defineTable({
    publicId: v.string(),
    title: v.string(),
    type: v.union(v.literal(STREAM_TYPES.AUDIO), v.literal(STREAM_TYPES.VIDEO)),
    status: v.union(
      v.literal(STREAM_STATUSES.SCHEDULED),
      v.literal(STREAM_STATUSES.LIVE),
      v.literal(STREAM_STATUSES.ENDED),
    ),
    ownerId: v.id("users"),
    orgId: v.optional(v.string()),
    orgName: v.optional(v.string()),
    orgImageUrl: v.optional(v.string()),
    rtmpKey: v.string(),
    hlsUrl: v.optional(v.string()),
    audioUrl: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    audioEgressId: v.optional(v.string()),
    scheduledFor: v.optional(v.number()),
    liveStartedAt: v.optional(v.number()),
    endedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_public_id", ["publicId"])
    .index("by_owner", ["ownerId"]),
  scenes: defineTable({
    streamId: v.id("streams"),
    name: v.string(),
    sources: v.array(v.id("sources")),
    order: v.number(),
    createdAt: v.number(),
  }).index("by_stream", ["streamId"]),
  sources: defineTable({
    streamId: v.id("streams"),
    type: v.string(),
    name: v.string(),
    config: v.optional(v.string()),
    position: v.optional(
      v.object({
        x: v.number(),
        y: v.number(),
      }),
    ),
    size: v.optional(
      v.object({
        width: v.number(),
        height: v.number(),
      }),
    ),
    zIndex: v.number(),
    createdAt: v.number(),
  }).index("by_stream", ["streamId"]),
  destinations: defineTable({
    streamId: v.id("streams"),
    platform: v.union(
      v.literal(DESTINATION_PLATFORMS.YOUTUBE),
      v.literal(DESTINATION_PLATFORMS.FACEBOOK),
      v.literal(DESTINATION_PLATFORMS.TWITCH),
      v.literal(DESTINATION_PLATFORMS.CUSTOM),
    ),
    rtmpUrl: v.string(),
    streamKey: v.string(),
    enabled: v.boolean(),
    createdAt: v.number(),
  }).index("by_stream", ["streamId"]),
  recordings: defineTable({
    streamId: v.id("streams"),
    type: v.union(v.literal(STREAM_TYPES.AUDIO), v.literal(STREAM_TYPES.VIDEO)),
    url: v.string(),
    downloadUrl: v.optional(v.string()),
    durationSeconds: v.number(),
    createdAt: v.number(),
  })
    .index("by_stream", ["streamId"])
    .index("by_created_at", ["createdAt"]),
  analytics: defineTable({
    streamId: v.id("streams"),
    viewerCount: v.number(),
    listenerCount: v.number(),
    country: v.string(),
    watchDurationSeconds: v.number(),
    recordedAt: v.number(),
  })
    .index("by_stream", ["streamId"])
    .index("by_recorded_at", ["recordedAt"]),
});
