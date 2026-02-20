"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Circle } from "lucide-react";

type AgentStatus = "running" | "idle" | "stopped";

const statusConfig: Record<
  AgentStatus,
  { color: string; dotColor: string; label: string; glowColor: string; bgColor: string }
> = {
  running: {
    color: "text-green-400",
    dotColor: "text-green-500",
    label: "Running",
    glowColor: "shadow-[0_0_12px_rgba(34,197,94,0.6)]",
    bgColor: "bg-green-500",
  },
  idle: {
    color: "text-yellow-400",
    dotColor: "text-yellow-500",
    label: "Idle",
    glowColor: "shadow-[0_0_12px_rgba(234,179,8,0.6)]",
    bgColor: "bg-yellow-500",
  },
  stopped: {
    color: "text-red-400",
    dotColor: "text-red-500",
    label: "Stopped",
    glowColor: "shadow-[0_0_12px_rgba(239,68,68,0.6)]",
    bgColor: "bg-red-500",
  },
};

export function AgentStatusPanel() {
  const agentStatuses = useQuery(api.agentStatus.list, {});

  if (!agentStatuses) {
    return (
      <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
        <h2 className="text-xl font-semibold mb-4">Agent Status</h2>
        <div className="flex items-center justify-center py-8 text-zinc-500">
          Loading agent statuses...
        </div>
      </div>
    );
  }

  // Sort agents: running first, then idle, then stopped
  const sortedAgents = [...agentStatuses].sort((a, b) => {
    const statusOrder = { running: 0, idle: 1, stopped: 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  // Count statuses
  const runningCount = agentStatuses.filter((a) => a.status === "running").length;
  const idleCount = agentStatuses.filter((a) => a.status === "idle").length;
  const stoppedCount = agentStatuses.filter((a) => a.status === "stopped").length;

  return (
    <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Agent Status</h2>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <Circle className="w-3 h-3 fill-green-500 text-green-500" />
            <span className="text-zinc-400">{runningCount} running</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Circle className="w-3 h-3 fill-yellow-500 text-yellow-500" />
            <span className="text-zinc-400">{idleCount} idle</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Circle className="w-3 h-3 fill-red-500 text-red-500" />
            <span className="text-zinc-400">{stoppedCount} stopped</span>
          </div>
        </div>
      </div>

      {agentStatuses.length === 0 ? (
        <div className="text-center py-8 text-zinc-500">
          No agents found. Initialize agents to get started.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {sortedAgents.map((agent) => {
            const config = statusConfig[agent.status];
            return (
              <div
                key={agent.agentId}
                className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50 hover:border-zinc-600 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate mb-1">
                      {agent.name}
                    </h3>
                    <p className="text-xs text-zinc-400 truncate">
                      {agent.role}
                    </p>
                  </div>
                  {/* Prominent status indicator on the RIGHT */}
                  <div className="flex items-center shrink-0">
                    <div
                      className={`w-4 h-4 rounded-full ${config.bgColor} ${config.glowColor} ${
                        agent.status === "running" ? "animate-pulse" : ""
                      }`}
                      title={config.label}
                    />
                  </div>
                </div>
                {agent.currentTask && (
                  <div className="mt-3 pt-3 border-t border-zinc-700/50">
                    <p className="text-xs text-zinc-400 line-clamp-2">
                      {agent.currentTask}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
