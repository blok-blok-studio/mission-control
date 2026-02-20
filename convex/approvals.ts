import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db
        .query("approvals")
        .withIndex("by_status", (q) => q.eq("status", args.status as any))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("approvals").order("desc").collect();
  },
});

export const pendingCount = query({
  args: {},
  handler: async (ctx) => {
    const pending = await ctx.db
      .query("approvals")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();
    return pending.length;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.union(
      v.literal("proposal"),
      v.literal("post"),
      v.literal("email"),
      v.literal("deploy"),
      v.literal("spend"),
      v.literal("other")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    submittedBy: v.string(),
    submittedByEmoji: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
    actionData: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const approvalId = await ctx.db.insert("approvals", {
      ...args,
      status: "pending",
      createdAt: now,
    });

    // Log activity
    await ctx.db.insert("activities", {
      type: "approval_submitted",
      title: `Approval requested: ${args.title}`,
      description: `${args.category} • ${args.priority} priority`,
      actor: args.submittedBy,
      actorEmoji: args.submittedByEmoji,
      entityType: "approval",
      entityId: approvalId,
      createdAt: now,
    });

    return approvalId;
  },
});

export const resolve = mutation({
  args: {
    id: v.id("approvals"),
    status: v.union(v.literal("approved"), v.literal("rejected")),
    reviewNote: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Get current approval to get details
    const approval = await ctx.db.get(args.id);
    if (!approval) throw new Error("Approval not found");

    await ctx.db.patch(args.id, {
      status: args.status,
      reviewNote: args.reviewNote,
      reviewedAt: now,
    });

    // Log activity
    await ctx.db.insert("activities", {
      type: "approval_resolved",
      title: `Approval ${args.status}: ${approval.title}`,
      description: args.reviewNote || `${args.status} by Chase`,
      actor: "Chase",
      actorEmoji: "👨‍💼",
      entityType: "approval",
      entityId: args.id,
      metadata: args.status,
      createdAt: now,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("approvals") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("approvals").collect();
    if (existing.length > 0) return { status: "already_seeded", count: existing.length };

    const now = Date.now();
    const proposals = [
      {
        title: "Social Intelligence Hub",
        description: "Automated competitor & brand monitoring across X, Reddit, web. Real-time alerts for mentions, sentiment, trends. Packaged as billable '24/7 Brand Intelligence' service for clients.\n\nEstimated build: 3-4 weeks\nROI: High — premium client service",
        category: "proposal" as const,
        priority: "medium" as const,
        submittedBy: "Cortana",
        submittedByEmoji: "⚡",
      },
      {
        title: "Content Factory Pipeline (RECOMMENDED)",
        description: "Multi-agent workflow: Research → Strategy → Writing → Design Brief → Quality. One brief produces blog + social + email + design assets. 10x content output without 10x headcount.\n\nEstimated build: 4-5 weeks\nROI: Very High — directly scales revenue",
        category: "proposal" as const,
        priority: "high" as const,
        submittedBy: "Cortana",
        submittedByEmoji: "⚡",
      },
      {
        title: "Client Command Center",
        description: "Unified mission control for all client accounts. Instant context recall, deadline monitoring, team coordination. Reduces mental overhead, enables scaling to 20+ clients.\n\nEstimated build: 3-4 weeks\nROI: High — service quality improvement",
        category: "proposal" as const,
        priority: "medium" as const,
        submittedBy: "Cortana",
        submittedByEmoji: "⚡",
      },
      {
        title: "Activity Feed & Timeline",
        description: "Real-time feed showing all actions across Mission Control: tasks moved, content published, agents working. Provides situational awareness + audit trail for 28 autonomous agents.\n\nEstimated build: ~4 hours\nImpact: Better visibility into agent activity",
        category: "proposal" as const,
        priority: "medium" as const,
        submittedBy: "Cortana",
        submittedByEmoji: "⚡",
      },
      {
        title: "Enhanced Command Palette",
        description: "Upgrade ⌘K to a full command center. Quick task creation (⌘T), fast navigation (⌘G), bulk operations, and keyboard shortcuts. Power user workflow without leaving the keyboard.\n\nEstimated build: ~4 hours\nImpact: Faster navigation and actions",
        category: "proposal" as const,
        priority: "low" as const,
        submittedBy: "Cortana",
        submittedByEmoji: "⚡",
      },
    ];

    for (const p of proposals) {
      await ctx.db.insert("approvals", {
        ...p,
        status: "pending",
        createdAt: now,
      });
    }

    return { status: "seeded", count: proposals.length };
  },
});
