import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Query: Get all agent statuses
export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("agentStatus").collect();
  },
});

// Query: Get status for a specific agent
export const getByAgentId = query({
  args: { agentId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("agentStatus")
      .withIndex("by_agentId", (q) => q.eq("agentId", args.agentId))
      .first();
  },
});

// Mutation: Update or create agent status
export const updateStatus = mutation({
  args: {
    agentId: v.string(),
    name: v.string(),
    role: v.string(),
    status: v.union(
      v.literal("running"),
      v.literal("idle"),
      v.literal("stopped")
    ),
    currentTask: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("agentStatus")
      .withIndex("by_agentId", (q) => q.eq("agentId", args.agentId))
      .first();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        name: args.name,
        role: args.role,
        status: args.status,
        currentTask: args.currentTask,
        lastUpdated: now,
      });
      return existing._id;
    } else {
      return await ctx.db.insert("agentStatus", {
        agentId: args.agentId,
        name: args.name,
        role: args.role,
        status: args.status,
        currentTask: args.currentTask,
        lastUpdated: now,
      });
    }
  },
});

// Mutation: Initialize all agents from DELEGATION.md
export const initializeAgents = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    
    const agents = [
      // C-Suite
      { agentId: "main", name: "Cortana", role: "COO / Chief of Staff" },
      { agentId: "nova", name: "Nova", role: "CMO" },
      { agentId: "atlas", name: "Atlas", role: "CTO" },
      { agentId: "sage", name: "Sage", role: "Account Manager" },
      { agentId: "muse", name: "Muse", role: "Creative Director" },
      
      // Marketing & Content
      { agentId: "hype", name: "Hype", role: "Social Media Manager" },
      { agentId: "rex", name: "Rex", role: "Script Writer" },
      { agentId: "scout", name: "Scout", role: "News Researcher" },
      { agentId: "quill", name: "Quill", role: "Email Writer" },
      { agentId: "spark", name: "Spark", role: "Ad Creative Designer" },
      { agentId: "boost", name: "Boost", role: "Ads Manager" },
      
      // Tech Team
      { agentId: "forge", name: "Forge", role: "Backend Developer" },
      { agentId: "pixel", name: "Pixel", role: "Frontend Developer" },
      { agentId: "sentry", name: "Sentry", role: "DevOps Engineer" },
      { agentId: "shield", name: "Shield", role: "Security Auditor" },
      { agentId: "dash", name: "Dash", role: "Dashboard Builder" },
      { agentId: "integrator", name: "Integrator", role: "AI Integrator" },
      { agentId: "chatbot", name: "Chatbot", role: "Conversational AI" },
      { agentId: "voice-agent", name: "Voice", role: "Voice AI" },
      
      // Creative Team
      { agentId: "palette", name: "Palette", role: "Brand Designer" },
      { agentId: "blueprint", name: "Blueprint", role: "Template Designer" },
      { agentId: "canvas-agent", name: "Canvas", role: "UI/Wireframe Designer" },
      { agentId: "motion", name: "Motion", role: "Motion Designer" },
      
      // Operations & Sales
      { agentId: "flow", name: "Flow", role: "Workflow Automation" },
      { agentId: "funnel", name: "Funnel", role: "Email Strategist" },
      { agentId: "hunter", name: "Hunter", role: "Lead Scraper" },
      { agentId: "reporter", name: "Reporter", role: "Client Reporter" },
      { agentId: "listener", name: "Listener", role: "Feedback Analyst" },
    ];

    for (const agent of agents) {
      const existing = await ctx.db
        .query("agentStatus")
        .withIndex("by_agentId", (q) => q.eq("agentId", agent.agentId))
        .first();

      if (!existing) {
        await ctx.db.insert("agentStatus", {
          agentId: agent.agentId,
          name: agent.name,
          role: agent.role,
          status: "idle",
          currentTask: undefined,
          lastUpdated: now,
        });
      }
    }

    return { count: agents.length };
  },
});

// Mutation: Set agent to running with task
export const setRunning = mutation({
  args: {
    agentId: v.string(),
    currentTask: v.string(),
  },
  handler: async (ctx, args) => {
    const agent = await ctx.db
      .query("agentStatus")
      .withIndex("by_agentId", (q) => q.eq("agentId", args.agentId))
      .first();

    if (!agent) {
      throw new Error(`Agent ${args.agentId} not found`);
    }

    await ctx.db.patch(agent._id, {
      status: "running",
      currentTask: args.currentTask,
      lastUpdated: Date.now(),
    });
  },
});

// Mutation: Set agent to idle
export const setIdle = mutation({
  args: {
    agentId: v.string(),
  },
  handler: async (ctx, args) => {
    const agent = await ctx.db
      .query("agentStatus")
      .withIndex("by_agentId", (q) => q.eq("agentId", args.agentId))
      .first();

    if (!agent) {
      throw new Error(`Agent ${args.agentId} not found`);
    }

    await ctx.db.patch(agent._id, {
      status: "idle",
      currentTask: undefined,
      lastUpdated: Date.now(),
    });
  },
});

// Mutation: Set agent to stopped
export const setStopped = mutation({
  args: {
    agentId: v.string(),
  },
  handler: async (ctx, args) => {
    const agent = await ctx.db
      .query("agentStatus")
      .withIndex("by_agentId", (q) => q.eq("agentId", args.agentId))
      .first();

    if (!agent) {
      throw new Error(`Agent ${args.agentId} not found`);
    }

    await ctx.db.patch(agent._id, {
      status: "stopped",
      currentTask: undefined,
      lastUpdated: Date.now(),
    });
  },
});
