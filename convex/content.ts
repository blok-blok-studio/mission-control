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
    const contentId = await ctx.db.insert("content", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });

    // Log activity
    await ctx.db.insert("activities", {
      type: "content_created",
      title: `New content: ${args.title}`,
      description: args.platform ? `${args.platform} • ${args.stage}` : args.stage,
      actor: "Nova",
      actorEmoji: "🚀",
      entityType: "content",
      entityId: contentId,
      createdAt: now,
    });

    return contentId;
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
    const now = Date.now();

    // Get current content to compare
    const content = await ctx.db.get(id);
    if (!content) throw new Error("Content not found");

    await ctx.db.patch(id, { ...filtered, updatedAt: now });

    // Log activity for stage changes
    if (args.stage && args.stage !== content.stage) {
      await ctx.db.insert("activities", {
        type: args.stage === "published" ? "content_published" : "content_stage_changed",
        title: `Content ${args.stage === "published" ? "published" : "moved"}: ${content.title}`,
        description: `${content.stage} → ${args.stage}`,
        actor: "Nova",
        actorEmoji: "🚀",
        entityType: "content",
        entityId: id,
        createdAt: now,
      });
    }
  },
});

export const remove = mutation({
  args: { id: v.id("content") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
