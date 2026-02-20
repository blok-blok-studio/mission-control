"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { FileText, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

const staticDocs = [
  { title: "AGENTS.md", description: "How Cortana operates", path: "AGENTS.md" },
  { title: "SOUL.md", description: "Cortana's personality & values", path: "SOUL.md" },
  { title: "USER.md", description: "About Chase", path: "USER.md" },
  { title: "GOALS.md", description: "Chase's goals & objectives", path: "GOALS.md" },
  { title: "TOOLS.md", description: "Tool-specific notes & model tiering", path: "TOOLS.md" },
  { title: "IDENTITY.md", description: "Who Cortana is", path: "IDENTITY.md" },
];

const agentDocs = [
  // Department Heads
  { title: "🚀 Nova (CMO)", description: "Marketing & content strategy", path: "agents/nova/workspace/SOUL.md", dept: "Leadership" },
  { title: "🎨 Muse (Creative Director)", description: "Brand, design, motion", path: "agents/muse/workspace/SOUL.md", dept: "Leadership" },
  { title: "⚙️ Atlas (CTO)", description: "Tech & development", path: "agents/atlas/workspace/SOUL.md", dept: "Leadership" },
  { title: "🤝 Sage (Account Manager)", description: "Client relations", path: "agents/sage/workspace/SOUL.md", dept: "Leadership" },
  // Marketing
  { title: "🔍 Scout", description: "News researcher", path: "agents/scout/workspace/SOUL.md", dept: "Marketing" },
  { title: "✍️ Rex", description: "Script writer", path: "agents/rex/workspace/SOUL.md", dept: "Marketing" },
  { title: "📣 Hype", description: "Social media manager", path: "agents/hype/workspace/SOUL.md", dept: "Marketing" },
  { title: "🎯 Hunter", description: "Lead scraper", path: "agents/hunter/workspace/SOUL.md", dept: "Marketing" },
  { title: "📊 Funnel", description: "Email strategist", path: "agents/funnel/workspace/SOUL.md", dept: "Marketing" },
  { title: "📝 Quill", description: "Email writer", path: "agents/quill/workspace/SOUL.md", dept: "Marketing" },
  { title: "💰 Boost", description: "Ads manager", path: "agents/boost/workspace/SOUL.md", dept: "Marketing" },
  // Creative
  { title: "🎭 Palette", description: "Brand designer", path: "agents/palette/workspace/SOUL.md", dept: "Creative" },
  { title: "📐 Blueprint", description: "Template designer", path: "agents/blueprint/workspace/SOUL.md", dept: "Creative" },
  { title: "🖼️ Canvas", description: "UI/wireframe designer", path: "agents/canvas-agent/workspace/SOUL.md", dept: "Creative" },
  { title: "✨ Spark", description: "Ad creative designer", path: "agents/spark/workspace/SOUL.md", dept: "Creative" },
  { title: "🎬 Motion", description: "Motion designer", path: "agents/motion/workspace/SOUL.md", dept: "Creative" },
  // Engineering
  { title: "💻 Pixel", description: "Frontend developer", path: "agents/pixel/workspace/SOUL.md", dept: "Engineering" },
  { title: "🔨 Forge", description: "Backend developer", path: "agents/forge/workspace/SOUL.md", dept: "Engineering" },
  { title: "🔄 Flow", description: "Workflow automation", path: "agents/flow/workspace/SOUL.md", dept: "Engineering" },
  { title: "🧠 Integrator", description: "AI integrator", path: "agents/integrator/workspace/SOUL.md", dept: "Engineering" },
  { title: "💬 Chatbot", description: "Conversational AI", path: "agents/chatbot/workspace/SOUL.md", dept: "Engineering" },
  { title: "🎙️ Voice", description: "Voice AI", path: "agents/voice-agent/workspace/SOUL.md", dept: "Engineering" },
  { title: "📈 Dash", description: "Dashboard builder", path: "agents/dash/workspace/SOUL.md", dept: "Engineering" },
  { title: "🛡️ Sentry", description: "DevOps engineer", path: "agents/sentry/workspace/SOUL.md", dept: "Engineering" },
  { title: "🔒 Shield", description: "Security auditor", path: "agents/shield/workspace/SOUL.md", dept: "Engineering" },
  // Client Relations
  { title: "📋 Reporter", description: "Client reporter", path: "agents/reporter/workspace/SOUL.md", dept: "Client Relations" },
  { title: "👂 Listener", description: "Feedback analyst", path: "agents/listener/workspace/SOUL.md", dept: "Client Relations" },
];

const deptOrder = ["Leadership", "Marketing", "Creative", "Engineering", "Client Relations"];

export default function DocsPage() {
  const docs = useQuery(api.docs.list, {});
  const [expanded, setExpanded] = useState<string | null>(null);

  const getDocContent = (path: string) => docs?.find((d) => d.path === path);
  const toggleExpand = (path: string) => setExpanded(expanded === path ? null : path);

  const groupedAgents = deptOrder.map((dept) => ({
    dept,
    agents: agentDocs.filter((a) => a.dept === dept),
  }));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Docs</h1>
        <p className="text-zinc-400 mt-1">
          System documentation — auto-updated by Cortana
        </p>
      </div>

      {/* System Files */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">
          System Files
        </h2>
        <div className="space-y-2">
          {staticDocs.map((doc) => (
            <DocRow key={doc.path} doc={doc} expanded={expanded} onToggle={toggleExpand} content={getDocContent(doc.path)} />
          ))}
        </div>
      </div>

      {/* Agent Profiles by Department */}
      {groupedAgents.map(({ dept, agents }) => (
        <div key={dept}>
          <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3">
            {dept === "Leadership" ? "Department Heads" : `${dept} Agents`}
          </h2>
          <div className="space-y-1.5">
            {agents.map((doc) => (
              <DocRow key={doc.path} doc={doc} expanded={expanded} onToggle={toggleExpand} content={getDocContent(doc.path)} isAgent />
            ))}
          </div>
        </div>
      ))}

      {/* Footer */}
      <div className="bg-zinc-800/30 rounded-xl p-5 border border-zinc-800/50">
        <h3 className="text-sm font-semibold mb-2">📝 Auto-Documentation</h3>
        <p className="text-xs text-zinc-500">
          Cortana automatically syncs these docs whenever system files change. All 28 agent profiles, goals, and configuration are always up to date.
        </p>
      </div>
    </div>
  );
}

function DocRow({
  doc,
  expanded,
  onToggle,
  content,
  isAgent,
}: {
  doc: { title: string; description: string; path: string };
  expanded: string | null;
  onToggle: (path: string) => void;
  content?: { content: string; updatedAt: number } | null;
  isAgent?: boolean;
}) {
  const isExpanded = expanded === doc.path;
  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
      <button
        onClick={() => onToggle(doc.path)}
        className="w-full flex items-center gap-4 p-3.5 hover:bg-zinc-800/50 transition-colors text-left"
      >
        {isExpanded ? (
          <ChevronDown size={14} className="text-zinc-500 flex-shrink-0" />
        ) : (
          <ChevronRight size={14} className="text-zinc-500 flex-shrink-0" />
        )}
        <FileText size={16} className={`flex-shrink-0 ${isAgent ? "text-amber-500/50" : "text-zinc-500"}`} />
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-medium ${isAgent ? "" : "font-mono"} truncate`}>{doc.title}</h3>
          <p className="text-[10px] text-zinc-500 truncate">{doc.description}</p>
        </div>
        {content && (
          <span className="text-[10px] text-zinc-600 flex-shrink-0">
            Updated {new Date(content.updatedAt).toLocaleDateString()}
          </span>
        )}
      </button>
      {isExpanded && (
        <div className="border-t border-zinc-800 p-4 bg-zinc-950">
          {content ? (
            <pre className="text-xs text-zinc-400 whitespace-pre-wrap font-mono max-h-96 overflow-y-auto">
              {content.content}
            </pre>
          ) : (
            <p className="text-xs text-zinc-600 italic">
              Not synced yet. Content will appear after next Cortana update cycle.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
