import { query } from "./_generated/server";
import { STREAM_STATUSES } from "./shared";
import { requireUser } from "./utils";

const MAX_DASHBOARD_ITEMS = 4;

export const getSnapshot = query({
  args: {},
  handler: async (ctx) => {
    const { user } = await requireUser(ctx);
    const streams = await ctx.db
      .query("streams")
      .withIndex("by_owner", (query) => query.eq("ownerId", user._id))
      .collect();

    const analyticsByStream = await Promise.all(
      streams.map(async (stream) => {
        const entries = await ctx.db
          .query("analytics")
          .withIndex("by_stream", (query) => query.eq("streamId", stream._id))
          .collect();
        return { streamId: stream._id, entries };
      }),
    );

    const analyticsTotals = analyticsByStream.flatMap(({ entries }) => entries);

    const analyticsSummary = analyticsTotals.reduce(
      (acc, entry) => {
        acc.totalViewers += entry.viewerCount;
        acc.totalListeners += entry.listenerCount;
        acc.peakViewers = Math.max(acc.peakViewers, entry.viewerCount);
        acc.totalWatchDuration += entry.watchDurationSeconds;
        return acc;
      },
      {
        totalViewers: 0,
        peakViewers: 0,
        totalListeners: 0,
        totalWatchDuration: 0,
      },
    );

    const averageWatchMinutes = analyticsTotals.length
      ? Math.round(
          analyticsSummary.totalWatchDuration / analyticsTotals.length / 60,
        )
      : 0;

    const upcomingStreams = streams
      .filter((stream) => stream.status === STREAM_STATUSES.SCHEDULED)
      .sort((a, b) => (a.scheduledFor ?? 0) - (b.scheduledFor ?? 0))
      .slice(0, MAX_DASHBOARD_ITEMS)
      .map((stream) => ({
        id: stream._id,
        title: stream.title,
        type: stream.type,
        status: stream.status,
        scheduledFor: stream.scheduledFor ?? stream.createdAt,
        publicId: stream.publicId,
      }));

    const activeStreams = streams
      .filter((stream) => stream.status === STREAM_STATUSES.LIVE)
      .slice(0, MAX_DASHBOARD_ITEMS)
      .map((stream) => {
        const metrics = analyticsByStream.find(
          (entry) => entry.streamId === stream._id,
        );
        const viewerCount = metrics
          ? metrics.entries.reduce((sum, entry) => sum + entry.viewerCount, 0)
          : 0;
        return {
          id: stream._id,
          title: stream.title,
          type: stream.type,
          status: stream.status,
          viewerCount,
          liveStartedAt: stream.liveStartedAt ?? stream.createdAt,
          publicId: stream.publicId,
        };
      });

    const recordings = await ctx.db
      .query("recordings")
      .withIndex("by_created_at")
      .order("desc")
      .collect();

    const streamById = new Map(streams.map((stream) => [stream._id, stream]));

    const recentRecordings = recordings
      .filter((recording) => streamById.has(recording.streamId))
      .slice(0, MAX_DASHBOARD_ITEMS)
      .map((recording) => {
        const stream = streamById.get(recording.streamId);
        return {
          id: recording._id,
          title: stream?.title ?? "Untitled Stream",
          type: recording.type,
          status: STREAM_STATUSES.ENDED,
          recordedAt: recording.createdAt,
          durationMinutes: Math.round(recording.durationSeconds / 60),
          publicId: stream?.publicId ?? "",
          url: recording.url,
        };
      });

    return {
      upcomingStreams,
      activeStreams,
      recentRecordings,
      analyticsSummary: {
        totalViewers: analyticsSummary.totalViewers,
        peakViewers: analyticsSummary.peakViewers,
        averageWatchMinutes,
        totalListeners: analyticsSummary.totalListeners,
      },
    };
  },
});
