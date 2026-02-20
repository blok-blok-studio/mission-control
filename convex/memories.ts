import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    category: v.optional(
      v.union(
        v.literal("decision"),
        v.literal("preference"),
        v.literal("project"),
        v.literal("insight"),
        v.literal("conversation"),
        v.literal("daily"),
        v.literal("other")
      )
    ),
  },
  handler: async (ctx, args) => {
    if (args.category) {
      return await ctx.db
        .query("memories")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .collect();
    }
    return await ctx.db.query("memories").order("desc").collect();
  },
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("memories")
      .withSearchIndex("search_memories", (q) => q.search("content", args.query))
      .take(20);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    category: v.union(
      v.literal("decision"),
      v.literal("preference"),
      v.literal("project"),
      v.literal("insight"),
      v.literal("conversation"),
      v.literal("daily"),
      v.literal("other")
    ),
    tags: v.optional(v.array(v.string())),
    source: v.optional(v.string()),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("memories", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("memories") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
