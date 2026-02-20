# Agent Status Panel - Mission Control

## Overview

A live, real-time agent status panel showing all 28 agents (27 agents + Cortana) with their current status and tasks.

## Features

✅ **Real-time updates** via Convex subscriptions (no polling)  
✅ **28 agents total** - All agents from DELEGATION.md + Cortana  
✅ **Color-coded status indicators**:
- 🟢 Green = Running (actively executing a task)
- 🟡 Yellow = Idle (available, not doing anything)
- 🔴 Red = Stopped / Error

✅ **Current task display** - Shows what running agents are working on  
✅ **Responsive grid layout** - Clean Tailwind design with Lucide icons  
✅ **Live status summary** - Quick counts of running/idle/stopped agents

## Files Created/Modified

### Convex Backend

1. **`convex/schema.ts`** - Added `agentStatus` table:
   ```typescript
   agentStatus: defineTable({
     agentId: v.string(),
     name: v.string(),
     role: v.string(),
     status: v.union(
       v.literal("running"),
       v.literal("idle"),
       v.literal("stopped")
     ),
     currentTask: v.optional(v.string()),
     lastUpdated: v.number(),
   }).index("by_agentId", ["agentId"])
   ```

2. **`convex/agentStatus.ts`** - New file with Convex functions:
   - `list()` - Query to get all agent statuses (auto-subscribing)
   - `getByAgentId(agentId)` - Query single agent status
   - `updateStatus()` - Update or create agent status
   - `initializeAgents()` - One-time setup to populate all 28 agents
   - `setRunning(agentId, currentTask)` - Mark agent as running
   - `setIdle(agentId)` - Mark agent as idle
   - `setStopped(agentId)` - Mark agent as stopped

### Frontend Components

3. **`src/components/AgentStatusPanel.tsx`** - Main panel component:
   - Real-time subscription to `agentStatus.list`
   - Responsive grid (1-4 columns based on screen size)
   - Status color indicators with live counts
   - Shows current task for running agents
   - Auto-sorts: running → idle → stopped

4. **`src/app/page.tsx`** - Updated dashboard:
   - Imported and added `<AgentStatusPanel />` component
   - Placed after Department Overview section

5. **`src/app/admin/page.tsx`** - Admin panel for initialization:
   - One-click button to initialize all agents
   - Status feedback
   - Integration examples and documentation

## Setup Instructions

### 1. Schema is already pushed

The Convex schema has been deployed with the `agentStatus` table.

### 2. Initialize agents

Visit `/admin` in your Mission Control app and click "Initialize Agent Status" to populate all 28 agents.

**Or run this in Convex dashboard:**
```typescript
await api.agentStatus.initializeAgents({})
```

### 3. View the dashboard

Go to the homepage `/` to see the live Agent Status Panel in action!

## Usage - Updating Agent Status

### From Your OpenClaw Agents

When an agent starts working:
```typescript
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

const setRunning = useMutation(api.agentStatus.setRunning);

await setRunning({
  agentId: "dash",
  currentTask: "Building new dashboard panel"
});
```

When an agent finishes:
```typescript
const setIdle = useMutation(api.agentStatus.setIdle);
await setIdle({ agentId: "dash" });
```

If an agent encounters an error:
```typescript
const setStopped = useMutation(api.agentStatus.setStopped);
await setStopped({ agentId: "dash" });
```

### From Convex Console

You can also update statuses directly in the Convex dashboard:

```typescript
// Mark Nova as running
await ctx.runMutation(api.agentStatus.setRunning, {
  agentId: "nova",
  currentTask: "Planning content strategy for Q1"
});

// Mark Atlas as idle
await ctx.runMutation(api.agentStatus.setIdle, {
  agentId: "atlas"
});
```

## Agent List (28 Total)

### C-Suite (5)
- Cortana (main) - COO / Chief of Staff
- Nova (nova) - CMO
- Atlas (atlas) - CTO
- Sage (sage) - Account Manager
- Muse (muse) - Creative Director

### Marketing & Content (6)
- Hype (hype) - Social Media Manager
- Rex (rex) - Script Writer
- Scout (scout) - News Researcher
- Quill (quill) - Email Writer
- Spark (spark) - Ad Creative Designer
- Boost (boost) - Ads Manager

### Tech Team (6)
- Forge (forge) - Backend Developer
- Pixel (pixel) - Frontend Developer
- Sentry (sentry) - DevOps Engineer
- Shield (shield) - Security Auditor
- Dash (dash) - Dashboard Builder
- Integrator (integrator) - AI Integrator
- Chatbot (chatbot) - Conversational AI
- Voice (voice-agent) - Voice AI

### Creative Team (4)
- Palette (palette) - Brand Designer
- Blueprint (blueprint) - Template Designer
- Canvas (canvas-agent) - UI/Wireframe Designer
- Motion (motion) - Motion Designer

### Operations & Sales (5)
- Flow (flow) - Workflow Automation
- Funnel (funnel) - Email Strategist
- Hunter (hunter) - Lead Scraper
- Reporter (reporter) - Client Reporter
- Listener (listener) - Feedback Analyst

## Technical Details

- **Real-time**: Uses Convex reactive queries - no polling, updates push instantly
- **Performance**: Efficient indexing on `agentId` for fast lookups
- **Scalable**: Can easily extend with more agents or metadata
- **Type-safe**: Full TypeScript support via Convex generated types
- **Clean UI**: Tailwind CSS + Lucide icons matching Mission Control's design system

## Future Enhancements

Potential additions:
- Agent performance metrics (tasks completed, uptime)
- Historical status logs
- Agent grouping by department with collapse/expand
- Filter/search functionality
- Click agent card to see detailed stats
- Integration with OpenClaw agent lifecycle hooks

## Troubleshooting

**Panel shows "Loading agent statuses..." forever:**
- Check Convex connection in browser console
- Verify schema was pushed: `npx convex dev`
- Ensure you initialized agents at `/admin`

**Agents not updating:**
- Verify mutations are being called correctly
- Check Convex dashboard logs for errors
- Ensure agentId matches exactly (case-sensitive)

**Can't find /admin page:**
- Clear Next.js cache: `rm -rf .next`
- Restart dev server: `npm run dev`

## Support

Built by Dash 🚀 for Mission Control's real-time agent monitoring.

For issues or questions, check the Convex console or Mission Control logs.
