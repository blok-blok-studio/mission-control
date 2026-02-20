"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const deptConfig: Record<string, { color: string; label: string }> = {
  Marketing: { color: "purple", label: "MARKETING" },
  Creative: { color: "pink", label: "CREATIVE STUDIO" },
  Engineering: { color: "blue", label: "ENGINEERING" },
  "Client Relations": { color: "green", label: "CLIENT RELATIONS" },
};

const deptBorderColors: Record<string, string> = {
  purple: "border-purple-500/20",
  pink: "border-pink-500/20",
  blue: "border-blue-500/20",
  green: "border-green-500/20",
};

const deptBgColors: Record<string, string> = {
  purple: "bg-purple-500/5",
  pink: "bg-pink-500/5",
  blue: "bg-blue-500/5",
  green: "bg-green-500/5",
};

const deptLabelColors: Record<string, string> = {
  purple: "text-purple-500/60",
  pink: "text-pink-500/60",
  blue: "text-blue-500/60",
  green: "text-green-500/60",
};

export default function OfficePage() {
  const agents = useQuery(api.agents.list, {});
  const agentStatuses = useQuery(api.agentStatus.list, {});
  const tasks = useQuery(api.tasks.list, {});

  const cortanaStatus = agentStatuses?.find((s) => s.agentId === "main");

  // Merge agent metadata with live status
  const mergedAgents = agents?.map((agent) => {
    const liveStatus = agentStatuses?.find((s) => s.agentId === agent.agentId);
    return {
      ...agent,
      status: liveStatus?.status === "running" ? "working" : liveStatus?.status === "idle" ? "idle" : "offline",
      currentTask: liveStatus?.currentTask,
      liveStatus: liveStatus?.status,
    };
  });

  // Group by department
  const departments = new Map<string, NonNullable<typeof mergedAgents>>();
  mergedAgents?.forEach((a) => {
    const dept = a.department ?? "Other";
    if (!departments.has(dept)) departments.set(dept, []);
    departments.get(dept)!.push(a);
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Office</h1>
        <p className="text-zinc-400 mt-1">See your team at work in real-time</p>
      </div>

      {/* Floor Plan */}
      <div className="relative bg-zinc-900 rounded-xl border border-zinc-800 p-6 min-h-[200px]">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-5 rounded-xl overflow-hidden">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10">
          {/* Executive Row */}
          <div className="text-[10px] text-zinc-600 font-mono mb-3">EXECUTIVE SUITE</div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Chase */}
            <div className="bg-zinc-800/80 backdrop-blur rounded-xl border border-amber-500/20 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-lg">
                  👤
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">Chase</p>
                  <p className="text-[10px] text-amber-400">CEO / Founder</p>
                </div>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </div>
            </div>
            {/* Cortana */}
            <div className="bg-zinc-800/80 backdrop-blur rounded-xl border border-amber-500/20 p-4 relative">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-lg">
                  ⚡
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">Cortana</p>
                  <p className="text-[10px] text-amber-400">COO / Chief of Staff</p>
                  {cortanaStatus?.currentTask && (
                    <p className="text-[9px] text-amber-300 mt-0.5 truncate">
                      🔥 {cortanaStatus.currentTask}
                    </p>
                  )}
                </div>
                {/* LED Status on the RIGHT */}
                {cortanaStatus && (
                  <div
                    className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      cortanaStatus.status === "running"
                        ? "bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)] animate-pulse"
                        : cortanaStatus.status === "idle"
                        ? "bg-yellow-500 shadow-[0_0_12px_rgba(234,179,8,0.6)]"
                        : "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]"
                    }`}
                    title={cortanaStatus.status.charAt(0).toUpperCase() + cortanaStatus.status.slice(1)}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Department Wings */}
          <div className="border-t border-dashed border-zinc-800 pt-4">
            <div className="text-[10px] text-zinc-600 font-mono mb-3">TEAM WORKSPACE</div>
            <div className="grid grid-cols-2 gap-4">
              {["Marketing", "Creative", "Engineering", "Client Relations"].map((deptName) => {
                const config = deptConfig[deptName];
                const deptAgents = departments.get(deptName) ?? [];
                const head = deptAgents.find((a) => !a.reportsTo || a.reportsTo === "Cortana");
                const members = deptAgents.filter((a) => a.reportsTo && a.reportsTo !== "Cortana");
                const workingCount = deptAgents.filter((a) => a.status === "working").length;

                return (
                  <div
                    key={deptName}
                    className={`${deptBgColors[config.color]} ${deptBorderColors[config.color]} border rounded-xl p-4`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[10px] font-mono font-semibold ${deptLabelColors[config.color]}`}>
                        {config.label}
                      </span>
                      <span className="text-[10px] text-zinc-600">
                        {workingCount}/{deptAgents.length} active
                      </span>
                    </div>

                    {/* Department Head */}
                    {head && (
                      <div className="bg-zinc-800/60 rounded-lg p-3 mb-3 flex items-center gap-3 relative">
                        <div className="w-9 h-9 rounded-full bg-zinc-700/50 flex items-center justify-center text-base">
                          {head.emoji ?? "🤖"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold">{head.name}</p>
                          <p className="text-[10px] text-zinc-500">{head.role}</p>
                          {head.currentTask && (
                            <p className="text-[9px] text-amber-400 truncate mt-0.5">
                              🔥 {head.currentTask}
                            </p>
                          )}
                        </div>
                        {/* LED Status on the RIGHT */}
                        {head.liveStatus && (
                          <div
                            className={`w-3 h-3 rounded-full flex-shrink-0 ${
                              head.liveStatus === "running"
                                ? "bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)] animate-pulse"
                                : head.liveStatus === "idle"
                                ? "bg-yellow-500 shadow-[0_0_12px_rgba(234,179,8,0.6)]"
                                : "bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)]"
                            }`}
                            title={head.liveStatus.charAt(0).toUpperCase() + head.liveStatus.slice(1)}
                          />
                        )}
                      </div>
                    )}

                    {/* Team Members Grid */}
                    <div className="grid grid-cols-3 gap-1.5">
                      {members.map((agent) => (
                        <div
                          key={agent._id}
                          className={`bg-zinc-800/40 rounded-lg p-2 text-center transition-colors relative ${
                            agent.status === "working" ? "ring-1 ring-green-500/30" : ""
                          } ${agent.status === "offline" ? "opacity-40" : ""}`}
                        >
                          <span className={`text-sm block ${agent.status === "working" ? "animate-bounce" : ""}`}>
                            {agent.emoji ?? "🤖"}
                          </span>
                          <p className="text-[10px] font-medium truncate mt-0.5">{agent.name}</p>
                          <p className="text-[8px] text-zinc-600 truncate">{agent.role}</p>
                          {agent.currentTask && (
                            <p className="text-[7px] text-amber-400 truncate mt-0.5">
                              {agent.currentTask}
                            </p>
                          )}
                          {/* LED Status on the TOP RIGHT */}
                          {agent.liveStatus && (
                            <div
                              className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
                                agent.liveStatus === "running"
                                  ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"
                                  : agent.liveStatus === "idle"
                                  ? "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]"
                                  : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                              }`}
                              title={agent.liveStatus.charAt(0).toUpperCase() + agent.liveStatus.slice(1)}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
        <h2 className="text-lg font-semibold mb-4">Activity Feed</h2>
        <div className="space-y-2">
          {(mergedAgents ?? [])
            .filter((a) => a.status === "working")
            .map((agent) => (
              <div
                key={agent._id}
                className="flex items-center gap-3 py-2 px-3 rounded-lg bg-zinc-800/50"
              >
                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
                <span className="text-base">{agent.emoji ?? "🤖"}</span>
                <span className="text-sm">
                  <strong>{agent.name}</strong>{" "}
                  <span className="text-zinc-400">
                    is working on: {agent.currentTask ?? "general tasks"}
                  </span>
                </span>
                <span className="text-[10px] text-zinc-600 ml-auto">{agent.department}</span>
              </div>
            ))}
          {(mergedAgents ?? []).filter((a) => a.status === "working").length === 0 && (
            <p className="text-zinc-500 text-sm">
              All agents are idle. Assign tasks to put them to work!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
