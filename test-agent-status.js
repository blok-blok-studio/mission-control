/**
 * Test Script for Agent Status System
 * 
 * This script demonstrates how to update agent statuses programmatically.
 * Run this after initializing agents to see live updates in the dashboard.
 * 
 * Usage: node test-agent-status.js
 * (Requires Convex client setup)
 */

// Example mutations to test the system:

const testScenarios = {
  "Scenario 1: Start a task": {
    mutation: "agentStatus.setRunning",
    args: {
      agentId: "dash",
      currentTask: "Building live agent status panel for Mission Control"
    }
  },
  
  "Scenario 2: Multiple agents working": [
    {
      mutation: "agentStatus.setRunning",
      args: { agentId: "nova", currentTask: "Planning Q1 content strategy" }
    },
    {
      mutation: "agentStatus.setRunning",
      args: { agentId: "rex", currentTask: "Writing video script about AI agents" }
    },
    {
      mutation: "agentStatus.setRunning",
      args: { agentId: "pixel", currentTask: "Building responsive dashboard UI" }
    }
  ],
  
  "Scenario 3: Complete a task": {
    mutation: "agentStatus.setIdle",
    args: { agentId: "dash" }
  },
  
  "Scenario 4: Agent error": {
    mutation: "agentStatus.setStopped",
    args: { agentId: "forge" }
  },
  
  "Scenario 5: Full team simulation": {
    description: "Simulate a typical workday",
    steps: [
      // Morning standup - everyone idle
      { mutation: "agentStatus.setIdle", args: { agentId: "cortana" } },
      
      // Marketing team starts
      { mutation: "agentStatus.setRunning", args: { agentId: "nova", currentTask: "Daily content review" } },
      { mutation: "agentStatus.setRunning", args: { agentId: "hype", currentTask: "Scheduling social media posts" } },
      { mutation: "agentStatus.setRunning", args: { agentId: "scout", currentTask: "Research: Latest AI developments" } },
      
      // Tech team deploys
      { mutation: "agentStatus.setRunning", args: { agentId: "atlas", currentTask: "Code review and architecture planning" } },
      { mutation: "agentStatus.setRunning", args: { agentId: "sentry", currentTask: "Monitoring server health" } },
      { mutation: "agentStatus.setRunning", args: { agentId: "shield", currentTask: "Security audit of new features" } },
      
      // Creative team working
      { mutation: "agentStatus.setRunning", args: { agentId: "muse", currentTask: "Brand direction for new client" } },
      { mutation: "agentStatus.setRunning", args: { agentId: "palette", currentTask: "Designing logo variations" } },
      
      // Some agents idle/stopped
      { mutation: "agentStatus.setIdle", args: { agentId: "boost" } },
      { mutation: "agentStatus.setIdle", args: { agentId: "funnel" } },
      { mutation: "agentStatus.setStopped", args: { agentId: "hunter" } } // Temporarily down
    ]
  }
};

console.log("🧪 Agent Status Test Scenarios");
console.log("================================\n");
console.log("Copy and paste these mutations into the Convex dashboard:\n");

Object.entries(testScenarios).forEach(([name, scenario]) => {
  console.log(`\n📋 ${name}`);
  console.log("-".repeat(50));
  
  if (Array.isArray(scenario)) {
    scenario.forEach((step, i) => {
      console.log(`\n// Step ${i + 1}:`);
      console.log(`await ctx.runMutation(api.${step.mutation}, ${JSON.stringify(step.args, null, 2)});`);
    });
  } else if (scenario.steps) {
    console.log(`\n// ${scenario.description}\n`);
    scenario.steps.forEach((step, i) => {
      console.log(`// ${i + 1}. ${step.args.currentTask || step.args.agentId}`);
      console.log(`await ctx.runMutation(api.${step.mutation}, ${JSON.stringify(step.args)});`);
    });
  } else {
    console.log(`\nawait ctx.runMutation(api.${scenario.mutation}, ${JSON.stringify(scenario.args, null, 2)});`);
  }
});

console.log("\n\n✨ Watch the dashboard update in real-time!\n");
console.log("💡 Pro tip: Open the dashboard in multiple browser windows");
console.log("   to see live synchronization across clients.\n");

// Quick reference
console.log("\n📚 Quick Reference");
console.log("================================");
console.log("\nAvailable Mutations:");
console.log("• agentStatus.setRunning(agentId, currentTask)");
console.log("• agentStatus.setIdle(agentId)");
console.log("• agentStatus.setStopped(agentId)");
console.log("• agentStatus.updateStatus({ agentId, name, role, status, currentTask })");
console.log("\nAvailable Queries:");
console.log("• agentStatus.list() - Get all agent statuses");
console.log("• agentStatus.getByAgentId(agentId) - Get specific agent");
console.log("\nAgent IDs:");
const agentIds = [
  "main (Cortana)", "nova", "atlas", "sage", "muse",
  "hype", "rex", "scout", "quill", "spark", "boost",
  "forge", "pixel", "sentry", "shield", "dash",
  "integrator", "chatbot", "voice-agent",
  "palette", "blueprint", "canvas-agent", "motion",
  "flow", "funnel", "hunter", "reporter", "listener"
];
console.log("• " + agentIds.join("\n• "));
console.log("\n");
