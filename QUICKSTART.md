# 🚀 Quick Start - Agent Status Panel

Get the Agent Status Panel up and running in 3 minutes!

## 1️⃣ Start Mission Control

```bash
cd /Users/cortana/.openclaw/workspace/mission-control
npm run dev
```

The app will be available at `http://localhost:3000`

## 2️⃣ Initialize Agents (One-time setup)

Open your browser and visit:
```
http://localhost:3000/admin
```

Click the big blue button:
```
"Initialize Agent Status"
```

You should see: **"✅ Successfully initialized 28 agents!"**

## 3️⃣ View the Dashboard

Go to the homepage:
```
http://localhost:3000
```

Scroll down to see the **Agent Status** panel showing all 28 agents! 🎉

## 4️⃣ Test Live Updates

Open the Convex Dashboard:
```
https://dashboard.convex.dev/t/tidy-penguin-909
```

In the Functions panel, try running this mutation:

```typescript
await ctx.runMutation(api.agentStatus.setRunning, {
  agentId: "dash",
  currentTask: "Testing the live status panel!"
});
```

**Watch the dashboard update instantly!** 🔥

## 5️⃣ More Test Scenarios

Run the test script to see all available examples:
```bash
node test-agent-status.js
```

Copy-paste the mutations into the Convex dashboard to simulate different scenarios.

## 🎯 Pro Tips

- **Open multiple browser tabs** to see real-time sync across clients
- **Status colors:**
  - 🟢 Green = Agent is running/working
  - 🟡 Yellow = Agent is idle/available
  - 🔴 Red = Agent is stopped/error
- **Current task** appears below running agents
- **Agents auto-sort** by status (running → idle → stopped)

## 📚 Next Steps

- Read `AGENT_STATUS_README.md` for full documentation
- Check `IMPLEMENTATION_SUMMARY.md` for technical details
- Integrate with your OpenClaw agents using the mutations
- Customize the UI in `src/components/AgentStatusPanel.tsx`

## ❓ Troubleshooting

**Panel stuck on "Loading..."**
- Ensure Convex is running: `npx convex dev`
- Check you initialized agents at `/admin`

**Status not updating**
- Verify the `agentId` matches exactly (case-sensitive)
- Check Convex dashboard logs for errors

**Can't find the panel**
- Clear cache: `rm -rf .next && npm run dev`

---

That's it! You now have live agent status tracking in Mission Control. 🎉

**Built by Dash 📈 | February 2026**
