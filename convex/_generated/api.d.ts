/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as analytics from "../analytics.js";
import type * as dashboard from "../dashboard.js";
import type * as destinations from "../destinations.js";
import type * as livekit from "../livekit.js";
import type * as publicAnalytics from "../publicAnalytics.js";
import type * as publicStreams from "../publicStreams.js";
import type * as recordings from "../recordings.js";
import type * as scenes from "../scenes.js";
import type * as shared from "../shared.js";
import type * as sources from "../sources.js";
import type * as streamUpdates from "../streamUpdates.js";
import type * as streams from "../streams.js";
import type * as streamsInternal from "../streamsInternal.js";
import type * as users from "../users.js";
import type * as utils from "../utils.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  analytics: typeof analytics;
  dashboard: typeof dashboard;
  destinations: typeof destinations;
  livekit: typeof livekit;
  publicAnalytics: typeof publicAnalytics;
  publicStreams: typeof publicStreams;
  recordings: typeof recordings;
  scenes: typeof scenes;
  shared: typeof shared;
  sources: typeof sources;
  streamUpdates: typeof streamUpdates;
  streams: typeof streams;
  streamsInternal: typeof streamsInternal;
  users: typeof users;
  utils: typeof utils;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
