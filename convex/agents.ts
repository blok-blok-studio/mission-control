import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("agents").collect();
  },
});

export const getByDepartment = query({
  args: { department: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("agents")
      .withIndex("by_department", (q) => q.eq("department", args.department))
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    role: v.string(),
    emoji: v.optional(v.string()),
    avatar: v.optional(v.string()),
    description: v.string(),
    responsibilities: v.array(v.string()),
    department: v.optional(v.string()),
    reportsTo: v.optional(v.string()),
    tier: v.optional(v.string()),
    agentId: v.optional(v.string()),
    status: v.union(
      v.literal("idle"),
      v.literal("working"),
      v.literal("offline")
    ),
    currentTask: v.optional(v.string()),
    model: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("agents", {
      ...args,
      totalTasksCompleted: 0,
      lastActiveAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("agents"),
    name: v.optional(v.string()),
    role: v.optional(v.string()),
    emoji: v.optional(v.string()),
    avatar: v.optional(v.string()),
    description: v.optional(v.string()),
    responsibilities: v.optional(v.array(v.string())),
    department: v.optional(v.string()),
    reportsTo: v.optional(v.string()),
    tier: v.optional(v.string()),
    agentId: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("idle"),
        v.literal("working"),
        v.literal("offline")
      )
    ),
    currentTask: v.optional(v.string()),
    model: v.optional(v.string()),
    totalTasksCompleted: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );
    const now = Date.now();
    const agent = await ctx.db.get(id);
    if (!agent) throw new Error("Agent not found");

    await ctx.db.patch(id, { ...filtered, lastActiveAt: now });

    // Log activity for status changes
    if (args.status && args.status !== agent.status) {
      await ctx.db.insert("activities", {
        type: "agent_status_changed",
        title: `${agent.name} is now ${args.status}`,
        description: args.currentTask ?? undefined,
        actor: agent.name,
        actorEmoji: agent.emoji ?? undefined,
        entityType: "agent",
        entityId: id,
        createdAt: now,
      });
    }
  },
});

export const remove = mutation({
  args: { id: v.id("agents") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const reseed = mutation({
  args: {},
  handler: async (ctx) => {
    // Delete all existing agents
    const existing = await ctx.db.query("agents").collect();
    for (const agent of existing) {
      await ctx.db.delete(agent._id);
    }

    const now = Date.now();
    const agents = [
      // Department Heads
      { name: "Nova", role: "Chief Marketing Officer", emoji: "🚀", department: "Marketing", reportsTo: "Cortana", tier: "sonnet", agentId: "nova", model: "Claude Sonnet 4.5", description: "Content strategy, social media, SEO, campaigns, brand voice", responsibilities: ["Content strategy and calendar", "Social media optimization", "SEO strategy", "Campaign ideation", "Brand voice consistency"] },
      { name: "Muse", role: "Creative Director", emoji: "🎨", department: "Creative", reportsTo: "Cortana", tier: "sonnet", agentId: "muse", model: "Claude Sonnet 4.5", description: "Brand, design, motion — all visual output", responsibilities: ["Oversee brand and design work", "Ensure visual consistency", "Direct creative strategy", "Review visual assets", "Translate goals into briefs"] },
      { name: "Atlas", role: "Chief Technology Officer", emoji: "⚙️", department: "Engineering", reportsTo: "Cortana", tier: "sonnet", agentId: "atlas", model: "Claude Sonnet 4.5", description: "Architecture, code, AI, DevOps, security", responsibilities: ["Architect technical solutions", "Oversee all development", "Manage DevOps and security", "Code review and QA", "Evaluate new technologies"] },
      { name: "Sage", role: "Account Manager", emoji: "🤝", department: "Client Relations", reportsTo: "Cortana", tier: "haiku", agentId: "sage", model: "Claude Haiku 4.5", description: "Client communications, reporting, feedback", responsibilities: ["Client communications", "Track timelines", "Gather feedback", "Prepare reports", "Coordinate between departments"] },
      // Nova → Content
      { name: "Scout", role: "News Researcher", emoji: "🔍", department: "Marketing", reportsTo: "Nova", tier: "haiku", agentId: "scout", model: "Claude Haiku 4.5", description: "Scans AI/tech news daily, curates top stories", responsibilities: ["Scan news sources daily", "Curate and rank stories", "Provide source links", "Identify trends", "Feed research to Rex"] },
      { name: "Rex", role: "Script Writer", emoji: "✍️", department: "Marketing", reportsTo: "Nova", tier: "sonnet", agentId: "rex", model: "Claude Sonnet 4.5", description: "Writes video scripts from research", responsibilities: ["Write video scripts", "Craft hooks", "Write in Chase's voice", "Adapt for platforms", "Optimize for engagement"] },
      { name: "Hype", role: "Social Media Manager", emoji: "📣", department: "Marketing", reportsTo: "Nova", tier: "haiku", agentId: "hype", model: "Claude Haiku 4.5", description: "Drafts posts for X, Threads, IG, LinkedIn", responsibilities: ["Draft social posts", "Optimize hashtags/timing", "Platform-native copy", "IG CTA on every post", "Track engagement"] },
      // Nova → Growth
      { name: "Hunter", role: "Lead Scraper", emoji: "🎯", department: "Marketing", reportsTo: "Nova", tier: "haiku", agentId: "hunter", model: "Claude Haiku 4.5", description: "Scrapes and enriches website leads", responsibilities: ["Scrape website leads", "Enrich lead data", "Score leads", "Maintain lead database", "Feed to Funnel"] },
      { name: "Funnel", role: "Email Strategist", emoji: "📊", department: "Marketing", reportsTo: "Nova", tier: "sonnet", agentId: "funnel", model: "Claude Sonnet 4.5", description: "Segments leads, designs email drip sequences", responsibilities: ["Segment leads", "Design drip sequences", "Trigger-based flows", "Analyze metrics", "Coordinate with Quill"] },
      { name: "Quill", role: "Email Writer", emoji: "📝", department: "Marketing", reportsTo: "Nova", tier: "haiku", agentId: "quill", model: "Claude Haiku 4.5", description: "Writes personalized outreach emails", responsibilities: ["Write outreach emails", "A/B test subject lines", "Keep emails human", "Adapt tone per sequence", "Quality over quantity"] },
      { name: "Boost", role: "Ads Manager", emoji: "💰", department: "Marketing", reportsTo: "Nova", tier: "sonnet", agentId: "boost", model: "Claude Sonnet 4.5", description: "Drafts ad copy and targeting. Never spends autonomously.", responsibilities: ["Draft ad copy", "Research keywords", "Monitor ad metrics", "Suggest budgets", "Chase approves ALL ads"] },
      // Muse → Brand
      { name: "Palette", role: "Brand Designer", emoji: "🎭", department: "Creative", reportsTo: "Muse", tier: "sonnet", agentId: "palette", model: "Claude Sonnet 4.5", description: "Logos, color palettes, brand guidelines", responsibilities: ["Design logos and palettes", "Create brand guidelines", "Build pitch decks", "Ensure brand consistency", "Adapt for industries"] },
      { name: "Blueprint", role: "Template Designer", emoji: "📐", department: "Creative", reportsTo: "Muse", tier: "haiku", agentId: "blueprint", model: "Claude Haiku 4.5", description: "Reusable design and email templates", responsibilities: ["Create design templates", "Social media templates", "Email templates", "Maintain template library", "Optimize for customization"] },
      // Muse → Design
      { name: "Canvas", role: "UI/Wireframe Designer", emoji: "🖼️", department: "Creative", reportsTo: "Muse", tier: "sonnet", agentId: "canvas-agent", model: "Claude Sonnet 4.5", description: "Wireframes, UI mockups, design systems", responsibilities: ["Create wireframes", "Design responsive layouts", "Build component libraries", "UX flow mapping", "Visual prototypes"] },
      { name: "Spark", role: "Ad Creative Designer", emoji: "✨", department: "Creative", reportsTo: "Muse", tier: "sonnet", agentId: "spark", model: "Claude Sonnet 4.5", description: "Ad creatives, social graphics, carousels", responsibilities: ["Design ad creatives", "Social media graphics", "Carousel templates", "A/B test visuals", "Coordinate with Boost"] },
      // Muse → Motion
      { name: "Motion", role: "Motion Designer", emoji: "🎬", department: "Creative", reportsTo: "Muse", tier: "sonnet", agentId: "motion", model: "Claude Sonnet 4.5", description: "Animated intros, motion graphics, thumbnails", responsibilities: ["Create animations", "Motion graphics for social", "Animated ad creatives", "Video thumbnails", "Motion templates"] },
      // Atlas → Frontend
      { name: "Pixel", role: "Frontend Developer", emoji: "💻", department: "Engineering", reportsTo: "Atlas", tier: "sonnet", agentId: "pixel", model: "Claude Sonnet 4.5", description: "Responsive websites, UI implementation", responsibilities: ["Build responsive sites", "Implement UI designs", "Optimize performance", "Cross-browser compat", "Clean frontend code"] },
      // Atlas → Backend
      { name: "Forge", role: "Backend Developer", emoji: "🔨", department: "Engineering", reportsTo: "Atlas", tier: "sonnet", agentId: "forge", model: "Claude Sonnet 4.5", description: "APIs, databases, auth, payments", responsibilities: ["Build APIs and databases", "Auth and payments", "Scalable data models", "Third-party integrations", "Code quality and docs"] },
      { name: "Flow", role: "Workflow Automation", emoji: "🔄", department: "Engineering", reportsTo: "Atlas", tier: "sonnet", agentId: "flow", model: "Claude Sonnet 4.5", description: "CRM, payments, onboarding automations", responsibilities: ["CRM automations", "Onboarding workflows", "Zapier/Make/n8n integrations", "Automate processes", "Connect services via APIs"] },
      // Atlas → AI
      { name: "Integrator", role: "AI Integrator", emoji: "🧠", department: "Engineering", reportsTo: "Atlas", tier: "sonnet", agentId: "integrator", model: "Claude Sonnet 4.5", description: "Custom AI solutions, RAG pipelines", responsibilities: ["Build custom AI solutions", "Integrate LLMs and vectors", "Design RAG pipelines", "AI-powered features", "Stay current on AI"] },
      { name: "Chatbot", role: "Conversational AI", emoji: "💬", department: "Engineering", reportsTo: "Atlas", tier: "sonnet", agentId: "chatbot", model: "Claude Sonnet 4.5", description: "Customer chatbots, conversation flows", responsibilities: ["Build chatbots", "Design conversation flows", "Multi-channel deployments", "Tune bot personalities", "Monitor performance"] },
      { name: "Voice", role: "Voice AI", emoji: "🎙️", department: "Engineering", reportsTo: "Atlas", tier: "sonnet", agentId: "voice-agent", model: "Claude Sonnet 4.5", description: "Voice assistants, IVR, speech-to-text", responsibilities: ["Build voice assistants", "Speech-to-text/TTS", "Voice UX flows", "Telephony integration", "Natural conversation"] },
      // Atlas → Dashboard
      { name: "Dash", role: "Dashboard Builder", emoji: "📈", department: "Engineering", reportsTo: "Atlas", tier: "sonnet", agentId: "dash", model: "Claude Sonnet 4.5", description: "Client dashboards, KPI widgets, white-label", responsibilities: ["Build analytics dashboards", "KPI widgets", "Real-time data", "White-label templates", "Mobile-responsive"] },
      // Atlas → IT & Security
      { name: "Sentry", role: "DevOps Engineer", emoji: "🛡️", department: "Engineering", reportsTo: "Atlas", tier: "haiku", agentId: "sentry", model: "Claude Haiku 4.5", description: "Server monitoring, CI/CD, deployments", responsibilities: ["Monitor server health", "CI/CD pipelines", "Manage deployments", "Logging and alerting", "Optimize infra costs"] },
      { name: "Shield", role: "Security Auditor", emoji: "🔒", department: "Engineering", reportsTo: "Atlas", tier: "haiku", agentId: "shield", model: "Claude Haiku 4.5", description: "Security audits, vulnerability scanning", responsibilities: ["Security audits", "Vulnerability scanning", "Access control review", "GDPR compliance", "Security documentation"] },
      // Sage → Client Ops
      { name: "Reporter", role: "Client Reporter", emoji: "📋", department: "Client Relations", reportsTo: "Sage", tier: "haiku", agentId: "reporter", model: "Claude Haiku 4.5", description: "Weekly/monthly client reports, KPI tracking", responsibilities: ["Generate client reports", "Compile KPIs", "Progress summaries", "Track milestones", "Format for presentation"] },
      { name: "Listener", role: "Feedback Analyst", emoji: "👂", department: "Client Relations", reportsTo: "Sage", tier: "haiku", agentId: "listener", model: "Claude Haiku 4.5", description: "Collect and categorize client feedback", responsibilities: ["Collect feedback", "Categorize patterns", "Flag urgent issues", "Summarize for team", "Track satisfaction"] },
    ];

    for (const agent of agents) {
      await ctx.db.insert("agents", {
        ...agent,
        status: "idle" as const,
        totalTasksCompleted: 0,
        lastActiveAt: now,
      });
    }

    return { status: "reseeded", count: agents.length };
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("agents").collect();
    if (existing.length > 0) return { status: "already_seeded", count: existing.length };
    // Delegate to reseed logic — but since we can't call mutations from mutations,
    // just return a message
    return { status: "use_reseed", count: 0 };
  },
});
