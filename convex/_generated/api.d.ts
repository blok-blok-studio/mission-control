/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as activities from "../activities.js";
import type * as agentStatus from "../agentStatus.js";
import type * as agents from "../agents.js";
import type * as approvals from "../approvals.js";
import type * as content from "../content.js";
import type * as docs from "../docs.js";
import type * as events from "../events.js";
import type * as feedback from "../feedback.js";
import type * as memories from "../memories.js";
import type * as tasks from "../tasks.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  activities: typeof activities;
  agentStatus: typeof agentStatus;
  agents: typeof agents;
  approvals: typeof approvals;
  content: typeof content;
  docs: typeof docs;
  events: typeof events;
  feedback: typeof feedback;
  memories: typeof memories;
  tasks: typeof tasks;
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
