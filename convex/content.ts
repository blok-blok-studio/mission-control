import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    stage: v.optional(
      v.union(
        v.literal("idea"),
        v.literal("outline"),
        v.literal("script"),
        v.literal("thumbnail"),
        v.literal("filming"),
        v.literal("editing"),
        v.literal("review"),
        v.literal("published")
      )
    ),
  },
  handler: async (ctx, args) => {
    if (args.stage) {
      return await ctx.db
        .query("content")
        .withIndex("by_stage", (q) => q.eq("stage", args.stage!))
        .collect();
    }
    return await ctx.db.query("content").collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    stage: v.union(
      v.literal("idea"),
      v.literal("outline"),
      v.literal("script"),
      v.literal("thumbnail"),
      v.literal("filming"),
      v.literal("editing"),
      v.literal("review"),
      v.literal("published")
    ),
    platform: v.optional(
      v.union(
        v.literal("youtube"),
        v.literal("tiktok"),
        v.literal("instagram"),
        v.literal("twitter"),
        v.literal("linkedin"),
        v.literal("blog"),
        v.literal("other")
      )
    ),
    script: v.optional(v.string()),
    notes: v.optional(v.string()),
    publishDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("content", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("content"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    stage: v.optional(
      v.union(
        v.literal("idea"),
        v.literal("outline"),
        v.literal("script"),
        v.literal("thumbnail"),
        v.literal("filming"),
        v.literal("editing"),
        v.literal("review"),
        v.literal("published")
      )
    ),
    platform: v.optional(
      v.union(
        v.literal("youtube"),
        v.literal("tiktok"),
        v.literal("instagram"),
        v.literal("twitter"),
        v.literal("linkedin"),
        v.literal("blog"),
        v.literal("other")
      )
    ),
    script: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    notes: v.optional(v.string()),
    publishDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );
    await ctx.db.patch(id, { ...filtered, updatedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("content") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
