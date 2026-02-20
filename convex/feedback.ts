import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("new"),
        v.literal("reviewed"),
        v.literal("actioned"),
        v.literal("archived")
      )
    ),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("feedback")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .collect();
    }
    return await ctx.db.query("feedback").order("desc").collect();
  },
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("feedback")
      .withSearchIndex("search_feedback", (q) =>
        q.search("content", args.query)
      )
      .take(20);
  },
});

export const create = mutation({
  args: {
    client: v.string(),
    content: v.string(),
    source: v.union(
      v.literal("email"),
      v.literal("call"),
      v.literal("chat"),
      v.literal("form"),
      v.literal("other")
    ),
    sentiment: v.optional(
      v.union(v.literal("positive"), v.literal("neutral"), v.literal("negative"))
    ),
    actionItems: v.optional(v.array(v.string())),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("feedback", {
      ...args,
      status: "new",
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("feedback"),
    status: v.optional(
      v.union(
        v.literal("new"),
        v.literal("reviewed"),
        v.literal("actioned"),
        v.literal("archived")
      )
    ),
    actionItems: v.optional(v.array(v.string())),
    sentiment: v.optional(
      v.union(v.literal("positive"), v.literal("neutral"), v.literal("negative"))
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );
    await ctx.db.patch(id, filtered);
  },
});

export const remove = mutation({
  args: { id: v.id("feedback") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
