import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Tasks Board
  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("backlog"),
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("done")
    ),
    assignee: v.string(),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high"),
      v.literal("urgent")
    ),
    project: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_assignee", ["assignee"])
    .index("by_project", ["project"]),

  // Content Pipeline
  content: defineTable({
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
    thumbnailUrl: v.optional(v.string()),
    notes: v.optional(v.string()),
    publishDate: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_stage", ["stage"])
    .index("by_platform", ["platform"]),

  // Calendar Events
  events: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    type: v.union(
      v.literal("cron"),
      v.literal("reminder"),
      v.literal("meeting"),
      v.literal("deadline"),
      v.literal("task")
    ),
    startTime: v.string(),
    endTime: v.optional(v.string()),
    recurring: v.optional(v.string()),
    cronJobId: v.optional(v.string()),
    color: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_startTime", ["startTime"]),

  // Memories
  memories: defineTable({
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
    createdAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_date", ["date"])
    .searchIndex("search_memories", {
      searchField: "content",
      filterFields: ["category"],
    }),

  // Documentation
  docs: defineTable({
    path: v.string(),
    title: v.string(),
    content: v.string(),
    description: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_path", ["path"]),

  // Client Feedback
  feedback: defineTable({
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
    status: v.union(
      v.literal("new"),
      v.literal("reviewed"),
      v.literal("actioned"),
      v.literal("archived")
    ),
    date: v.string(),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_client", ["client"])
    .searchIndex("search_feedback", {
      searchField: "content",
      filterFields: ["status"],
    }),

  // Team / Agents
  agents: defineTable({
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
    totalTasksCompleted: v.number(),
    lastActiveAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_department", ["department"])
    .index("by_agentId", ["agentId"]),

  // Approvals
  approvals: defineTable({
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
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("expired")
    ),
    submittedBy: v.string(),
    submittedByEmoji: v.optional(v.string()),
    reviewNote: v.optional(v.string()),
    reviewedAt: v.optional(v.number()),
    expiresAt: v.optional(v.number()),
    actionData: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_category", ["category"])
    .index("by_submittedBy", ["submittedBy"]),

  // Activity Feed
  activities: defineTable({
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
    createdAt: v.number(),
  })
    .index("by_createdAt", ["createdAt"])
    .index("by_type", ["type"])
    .index("by_actor", ["actor"]),
});
