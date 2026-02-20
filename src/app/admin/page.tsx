"use client";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";

export default function AdminPage() {
  const initializeAgents = useMutation(api.agentStatus.initializeAgents);
  const [status, setStatus] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInitialize = async () => {
    setIsLoading(true);
    setStatus("Initializing agents...");
    try {
      const result = await initializeAgents({});
      setStatus(`✅ Successfully initialized ${result.count} agents!`);
    } catch (error) {
      setStatus(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-zinc-400 mt-1">System administration and maintenance</p>
      </div>

      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <h2 className="text-xl font-semibold mb-4">Agent Status System</h2>
        <p className="text-zinc-400 mb-6">
          Initialize all 28 agents (27 agents + Cortana) in the agentStatus table for
          real-time status tracking.
        </p>
        
        <button
          onClick={handleInitialize}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-700 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-colors"
        >
          {isLoading ? "Initializing..." : "Initialize Agent Status"}
        </button>

        {status && (
          <div className="mt-4 p-4 bg-zinc-800 rounded-lg">
            <p className="text-sm">{status}</p>
          </div>
        )}
      </div>

      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <h2 className="text-xl font-semibold mb-4">Instructions</h2>
        <div className="space-y-3 text-sm text-zinc-400">
          <p>
            <strong className="text-white">1. Initialize Agents:</strong> Click the button
            above to populate the agentStatus table with all 28 agents.
          </p>
          <p>
            <strong className="text-white">2. Real-time Updates:</strong> The dashboard
            will automatically subscribe to status changes via Convex.
          </p>
          <p>
            <strong className="text-white">3. Update Status:</strong> Use the Convex
            mutations to update agent status:
          </p>
          <ul className="list-disc list-inside pl-4 space-y-1">
            <li>
              <code className="bg-zinc-800 px-2 py-1 rounded">
                agentStatus.setRunning(agentId, currentTask)
              </code>
            </li>
            <li>
              <code className="bg-zinc-800 px-2 py-1 rounded">
                agentStatus.setIdle(agentId)
              </code>
            </li>
            <li>
              <code className="bg-zinc-800 px-2 py-1 rounded">
                agentStatus.setStopped(agentId)
              </code>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <h2 className="text-xl font-semibold mb-4">Integration Example</h2>
        <div className="bg-zinc-800 p-4 rounded-lg">
          <pre className="text-xs text-zinc-300 overflow-x-auto">
{`// Example: Update agent status when starting a task
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

const setRunning = useMutation(api.agentStatus.setRunning);

// When agent starts working
await setRunning({
  agentId: "dash",
  currentTask: "Building dashboard component"
});

// When agent finishes
const setIdle = useMutation(api.agentStatus.setIdle);
await setIdle({ agentId: "dash" });`}
          </pre>
        </div>
      </div>
    </div>
  );
}
