import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Log a new activity
export const log = mutation({
  args: {
    type: v.union(
      v.literal("task_created"),
      v.literal("task_updated"),
      v.literal("task_completed"),
      v.literal("content_created"),
      v.literal("content_stage_changed"),
      v.literal("content_published"),
      v.literal("agent_status_changed"),
      v.literal("approval_submitted"),
      v.literal("approval_resolved"),
      v.literal("cron_completed"),
      v.literal("feedback_received"),
      v.literal("memory_created")
    ),
    title: v.string(),
    description: v.optional(v.string()),
    actor: v.optional(v.string()),
    actorEmoji: v.optional(v.string()),
    entityType: v.optional(
      v.union(
        v.literal("task"),
        v.literal("content"),
        v.literal("agent"),
        v.literal("approval"),
        v.literal("feedback"),
        v.literal("memory"),
        v.literal("cron")
      )
    ),
    entityId: v.optional(v.string()),
    metadata: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("activities", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// Get recent activities with optional limit
export const recent = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    return await ctx.db
      .query("activities")
      .withIndex("by_createdAt")
      .order("desc")
      .take(limit);
  },
});

// Get activities by type
export const byType = query({
  args: {
    type: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    return await ctx.db
      .query("activities")
      .withIndex("by_type", (q) => q.eq("type", args.type as any))
      .order("desc")
      .take(limit);
  },
});

// Get activities by actor
export const byActor = query({
  args: {
    actor: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    return await ctx.db
      .query("activities")
      .withIndex("by_actor", (q) => q.eq("actor", args.actor))
      .order("desc")
      .take(limit);
  },
});

// Delete old activities (cleanup)
export const cleanup = mutation({
  args: {
    olderThanDays: v.number(),
  },
  handler: async (ctx, args) => {
    const cutoffTime = Date.now() - args.olderThanDays * 24 * 60 * 60 * 1000;
    const oldActivities = await ctx.db
      .query("activities")
      .withIndex("by_createdAt")
      .filter((q) => q.lt(q.field("createdAt"), cutoffTime))
      .collect();

    let deleted = 0;
    for (const activity of oldActivities) {
      await ctx.db.delete(activity._id);
      deleted++;
    }
    return { deleted };
  },
});
