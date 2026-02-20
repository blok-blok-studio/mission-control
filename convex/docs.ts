import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// We'll store doc snapshots in Convex so the UI can display them
// Cortana updates these whenever files change

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("docs").collect();
  },
});

export const upsert = mutation({
  args: {
    path: v.string(),
    title: v.string(),
    content: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("docs")
      .filter((q) => q.eq(q.field("path"), args.path))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        content: args.content,
        title: args.title,
        description: args.description,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("docs", {
        ...args,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }
  },
});
