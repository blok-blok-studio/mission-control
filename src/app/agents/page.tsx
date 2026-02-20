"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect } from "react";

const deptColors: Record<string, { border: string; bg: string; text: string }> = {
  Marketing: { border: "border-purple-500/30", bg: "bg-purple-500/15", text: "text-purple-400" },
  Creative: { border: "border-pink-500/30", bg: "bg-pink-500/15", text: "text-pink-400" },
  Engineering: { border: "border-blue-500/30", bg: "bg-blue-500/15", text: "text-blue-400" },
  "Client Relations": { border: "border-green-500/30", bg: "bg-green-500/15", text: "text-green-400" },
};

const tierBadge: Record<string, { bg: string; text: string; label: string }> = {
  opus: { bg: "bg-amber-500/20", text: "text-amber-300", label: "Opus" },
  sonnet: { bg: "bg-blue-500/20", text: "text-blue-300", label: "Sonnet" },
  haiku: { bg: "bg-zinc-600/40", text: "text-zinc-400", label: "Haiku" },
};

// Live status from agentStatus table
const statusConfig: Record<string, { bg: string; glow: string; dot: string }> = {
  running: { 
    bg: "bg-green-500",
    glow: "shadow-[0_0_12px_rgba(34,197,94,0.6)]",
    dot: "bg-green-500 animate-pulse"
  },
  idle: { 
    bg: "bg-yellow-500",
    glow: "shadow-[0_0_12px_rgba(234,179,8,0.6)]",
    dot: "bg-yellow-500"
  },
  stopped: { 
    bg: "bg-red-500",
    glow: "shadow-[0_0_12px_rgba(239,68,68,0.6)]",
    dot: "bg-red-500"
  },
};

// Org structure definition
const orgStructure = {
  nova: {
    content: ["scout", "rex", "hype"],
    growth: ["hunter", "funnel", "quill", "boost"],
  },
  muse: {
    brand: ["palette", "blueprint"],
    design: ["canvas-agent", "spark"],
    motion: ["motion"],
  },
  atlas: {
    frontend: ["pixel"],
    backend: ["forge", "flow"],
    ai: ["integrator", "chatbot", "voice-agent"],
    dashboard: ["dash"],
    "it & security": ["sentry", "shield"],
  },
  sage: {
    "client ops": ["reporter", "listener"],
  },
};

export default function OrgChartPage() {
  const agents = useQuery(api.agents.list, {});
  const agentStatuses = useQuery(api.agentStatus.list, {});
  const seedAgents = useMutation(api.agents.seed);

  // Auto-seed if empty
  useEffect(() => {
    if (agents && agents.length === 0) {
      seedAgents();
    }
  }, [agents, seedAgents]);

  // Merge agent metadata with live status
  const getAgent = (agentId: string) => {
    const agent = agents?.find((a) => a.agentId === agentId);
    const liveStatus = agentStatuses?.find((s) => s.agentId === agentId);
    if (!agent) return undefined;
    const mappedStatus = (liveStatus?.status === "running" ? "working" : liveStatus?.status === "idle" ? "idle" : "offline") as "idle" | "working" | "offline";
    return {
      ...agent,
      status: mappedStatus,
      currentTask: liveStatus?.currentTask,
      liveStatus: liveStatus?.status as "running" | "idle" | "stopped" | undefined,
    };
  };
  const getDeptHead = (name: string) => {
    const agent = agents?.find((a) => a.name === name);
    const liveStatus = agent?.agentId ? agentStatuses?.find((s) => s.agentId === agent.agentId) : undefined;
    if (!agent) return undefined;
    const mappedStatus = (liveStatus?.status === "running" ? "working" : liveStatus?.status === "idle" ? "idle" : "offline") as "idle" | "working" | "offline";
    return {
      ...agent,
      status: mappedStatus,
      currentTask: liveStatus?.currentTask,
      liveStatus: liveStatus?.status as "running" | "idle" | "stopped" | undefined,
    };
  };

  const deptHeads = [
    { key: "nova", name: "Nova", dept: "Marketing" },
    { key: "muse", name: "Muse", dept: "Creative" },
    { key: "atlas", name: "Atlas", dept: "Engineering" },
    { key: "sage", name: "Sage", dept: "Client Relations" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Org Chart</h1>
        <p className="text-zinc-400 mt-1">
          Blok Blok Studio — 28 agents across 4 departments
        </p>
      </div>

      {/* Top: CEO + COO */}
      <div className="flex flex-col items-center gap-2">
        <LeaderCard
          name="Chase"
          role="CEO / Founder"
          emoji="👤"
          color="amber"
          subtitle="Vision, strategy, final decisions"
        />
        <Connector />
        <LeaderCard
          name="Cortana"
          role="COO / Chief of Staff"
          emoji="⚡"
          color="amber"
          subtitle="Orchestration, delegation, automation"
          model="Claude Opus 4"
          tier="opus"
          liveStatus={agentStatuses?.find((s) => s.agentId === "main")?.status}
          currentTask={agentStatuses?.find((s) => s.agentId === "main")?.currentTask}
        />
        <Connector />
      </div>

      {/* Tree connector: Cortana → Department Heads */}
      <div className="flex justify-center relative h-12">
        {/* Vertical drop from Cortana */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-6 bg-zinc-600" />
        {/* Horizontal bar spanning all dept heads */}
        <div className="absolute top-6 left-[12%] right-[12%] h-[2px] bg-zinc-600" />
        {/* Vertical drops to each dept head */}
        <div className="absolute top-6 left-[18.5%] w-[2px] h-6 bg-zinc-600" />
        <div className="absolute top-6 left-[40.5%] w-[2px] h-6 bg-zinc-600" />
        <div className="absolute top-6 left-[59.5%] w-[2px] h-6 bg-zinc-600" />
        <div className="absolute top-6 left-[81.5%] w-[2px] h-6 bg-zinc-600" />
      </div>

      {/* Department Heads + Their Teams */}
      <div className="grid grid-cols-4 gap-5">
        {deptHeads.map(({ key, name, dept }) => {
          const head = getDeptHead(name);
          const colors = deptColors[dept] ?? deptColors.Engineering;
          const divisions = orgStructure[key as keyof typeof orgStructure];

          return (
            <div key={key} className="space-y-3">
              {/* Department Head */}
              <div className={`bg-zinc-900 ${colors.border} border rounded-xl p-4 text-center relative`}>
                <div className={`w-11 h-11 rounded-full ${colors.bg} flex items-center justify-center text-lg mx-auto mb-2`}>
                  {head?.emoji ?? "🤖"}
                </div>
                <p className="font-bold text-sm">{name}</p>
                <p className="text-[11px] text-zinc-400">{head?.role ?? dept}</p>
                {head?.model && (
                  <span className={`inline-block text-[9px] px-1.5 py-0.5 rounded mt-1.5 ${tierBadge[head.tier ?? "sonnet"].bg} ${tierBadge[head.tier ?? "sonnet"].text}`}>
                    {head.model}
                  </span>
                )}
                {/* LED Status on the RIGHT side */}
                {head && head.liveStatus && (
                  <div className="absolute top-4 right-4">
                    <div
                      className={`w-3 h-3 rounded-full ${statusConfig[head.liveStatus].bg} ${statusConfig[head.liveStatus].glow} ${
                        head.liveStatus === "running" ? "animate-pulse" : ""
                      }`}
                      title={head.liveStatus.charAt(0).toUpperCase() + head.liveStatus.slice(1)}
                    />
                  </div>
                )}
              </div>

              {/* Tree connector from head to divisions */}
              <div className="relative h-8 flex justify-center">
                {/* Vertical drop from dept head */}
                <div className="absolute top-0 w-[2px] h-4 bg-zinc-600" />
                {/* Horizontal bar spanning divisions */}
                {Object.keys(divisions).length > 1 && (
                  <div className="absolute top-4 left-[20%] right-[20%] h-[2px] bg-zinc-600" />
                )}
                {/* Vertical drops to each division */}
                {Object.keys(divisions).length === 1 ? (
                  <div className="absolute top-4 w-[2px] h-4 bg-zinc-600" />
                ) : Object.keys(divisions).length === 2 ? (
                  <>
                    <div className="absolute top-4 left-[30%] w-[2px] h-4 bg-zinc-600" />
                    <div className="absolute top-4 right-[30%] w-[2px] h-4 bg-zinc-600" />
                  </>
                ) : Object.keys(divisions).length === 3 ? (
                  <>
                    <div className="absolute top-4 left-[25%] w-[2px] h-4 bg-zinc-600" />
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[2px] h-4 bg-zinc-600" />
                    <div className="absolute top-4 right-[25%] w-[2px] h-4 bg-zinc-600" />
                  </>
                ) : (
                  <>
                    <div className="absolute top-4 left-[20%] w-[2px] h-4 bg-zinc-600" />
                    <div className="absolute top-4 left-[40%] w-[2px] h-4 bg-zinc-600" />
                    <div className="absolute top-4 right-[40%] w-[2px] h-4 bg-zinc-600" />
                    <div className="absolute top-4 right-[20%] w-[2px] h-4 bg-zinc-600" />
                  </>
                )}
              </div>

              {/* Divisions */}
              {Object.entries(divisions).map(([divName, agentIds]) => (
                <div key={divName} className="mb-4">
                  <p className={`text-[10px] font-semibold uppercase tracking-wider ${colors.text} px-2 text-center mb-2`}>
                    {divName}
                  </p>
                  {/* Tree structure for agents in this division */}
                  <div className="relative">
                    {/* Single agent - just vertical line */}
                    {agentIds.length === 1 && (
                      <div className="flex flex-col items-center">
                        <div className="w-[2px] h-4 bg-zinc-600" />
                        <AgentCard agent={getAgent(agentIds[0])} agentId={agentIds[0]} />
                      </div>
                    )}
                    
                    {/* Multiple agents - tree structure */}
                    {agentIds.length > 1 && (
                      <div className="flex flex-col items-center">
                        {/* Vertical drop from division label */}
                        <div className="w-[2px] h-4 bg-zinc-600 mb-0" />
                        {/* Horizontal bar + vertical drops container */}
                        <div className="relative w-full h-6 mb-2">
                          {/* Horizontal bar spanning agents */}
                          <div 
                            className="absolute top-0 h-[2px] bg-zinc-600"
                            style={{
                              left: `${100 / (agentIds.length * 2)}%`,
                              right: `${100 / (agentIds.length * 2)}%`
                            }}
                          />
                          {/* Vertical drops to each agent */}
                          {agentIds.map((_, idx) => {
                            const spacing = 100 / (agentIds.length + 1);
                            const leftPercent = spacing * (idx + 1);
                            return (
                              <div
                                key={idx}
                                className="absolute top-0 w-[2px] h-6 bg-zinc-600"
                                style={{ left: `${leftPercent}%`, transform: 'translateX(-1px)' }}
                              />
                            );
                          })}
                        </div>
                        {/* Agent cards in a row */}
                        <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${agentIds.length}, 1fr)` }}>
                          {agentIds.map((agentId) => (
                            <AgentCard key={agentId} agent={getAgent(agentId)} agentId={agentId} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 justify-center text-xs text-zinc-600 pt-4 border-t border-zinc-800/50">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500" /> Working
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-zinc-500" /> Idle
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500" /> Offline
        </span>
        <span className="text-zinc-700">|</span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded ${tierBadge.opus.bg} ${tierBadge.opus.text}`}>Opus</span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded ${tierBadge.sonnet.bg} ${tierBadge.sonnet.text}`}>Sonnet</span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded ${tierBadge.haiku.bg} ${tierBadge.haiku.text}`}>Haiku</span>
      </div>
    </div>
  );
}

function LeaderCard({
  name,
  role,
  emoji,
  color,
  subtitle,
  model,
  tier,
  liveStatus,
  currentTask,
}: {
  name: string;
  role: string;
  emoji: string;
  color: string;
  subtitle: string;
  model?: string;
  tier?: string;
  liveStatus?: "running" | "idle" | "stopped";
  currentTask?: string;
}) {
  const statusStyle = liveStatus ? statusConfig[liveStatus] : statusConfig.idle;
  
  return (
    <div className="bg-zinc-900 border border-amber-500/30 rounded-xl px-6 py-4 w-80 text-center relative">
      <div className="w-12 h-12 rounded-full bg-amber-500/15 flex items-center justify-center text-xl mx-auto mb-2">
        {emoji}
      </div>
      <p className="font-bold">{name}</p>
      <p className="text-xs text-zinc-400">{role}</p>
      <p className="text-[10px] text-zinc-600 mt-1">{subtitle}</p>
      {model && tier && (
        <span className={`inline-block text-[9px] px-1.5 py-0.5 rounded mt-1.5 ${tierBadge[tier].bg} ${tierBadge[tier].text}`}>
          {model}
        </span>
      )}
      {currentTask && (
        <p className="text-[9px] text-amber-400 bg-amber-500/10 px-2 py-1 rounded mt-2 truncate">
          🔥 {currentTask}
        </p>
      )}
      {/* LED Status on the RIGHT side */}
      {liveStatus && (
        <div className="absolute top-4 right-4">
          <div
            className={`w-4 h-4 rounded-full ${statusStyle.bg} ${statusStyle.glow} ${
              liveStatus === "running" ? "animate-pulse" : ""
            }`}
            title={liveStatus.charAt(0).toUpperCase() + liveStatus.slice(1)}
          />
        </div>
      )}
    </div>
  );
}

function AgentCard({
  agent,
  agentId,
}: {
  agent?: {
    name: string;
    role: string;
    emoji?: string;
    status: "idle" | "working" | "offline";
    currentTask?: string;
    tier?: string;
    model?: string;
    description: string;
    liveStatus?: "running" | "idle" | "stopped";
  };
  agentId: string;
}) {
  if (!agent) {
    return (
      <div className="bg-zinc-900/50 border border-dashed border-zinc-800 rounded-lg px-3 py-2 text-center">
        <p className="text-[10px] text-zinc-700">{agentId}</p>
      </div>
    );
  }

  const badge = tierBadge[agent.tier ?? "sonnet"];
  const liveStatusKey = agent.liveStatus ?? "stopped";
  const statusStyle = statusConfig[liveStatusKey];

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2.5 hover:border-zinc-700 transition-colors group">
      <div className="flex items-center gap-2.5">
        <span className="text-base flex-shrink-0">{agent.emoji ?? "🤖"}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold truncate">{agent.name}</p>
          <p className="text-[10px] text-zinc-500 truncate">{agent.role}</p>
        </div>
        <span className={`text-[8px] px-1 py-0.5 rounded flex-shrink-0 ${badge.bg} ${badge.text}`}>
          {badge.label}
        </span>
        {/* LED Status Indicator on the RIGHT */}
        <div
          className={`w-3 h-3 rounded-full flex-shrink-0 ${statusStyle.bg} ${statusStyle.glow} ${
            liveStatusKey === "running" ? "animate-pulse" : ""
          }`}
          title={liveStatusKey.charAt(0).toUpperCase() + liveStatusKey.slice(1)}
        />
      </div>
      {agent.currentTask && (
        <p className="text-[9px] text-amber-400 bg-amber-500/10 px-2 py-1 rounded mt-2 truncate">
          🔥 {agent.currentTask}
        </p>
      )}
      {/* Tooltip-style description on hover */}
      <p className="text-[9px] text-zinc-600 mt-1 line-clamp-1 group-hover:line-clamp-none transition-all">
        {agent.description}
      </p>
    </div>
  );
}

function Connector() {
  return (
    <div className="flex justify-center">
      <div className="w-px h-6 bg-zinc-700" />
    </div>
  );
}
