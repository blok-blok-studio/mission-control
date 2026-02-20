"use client";

import { FolderOpen, Plus, ExternalLink } from "lucide-react";

const projects = [
  {
    name: "Mission Control",
    status: "active",
    description: "This dashboard — Next.js + Convex",
    progress: 85,
    team: ["⚡ Cortana", "💻 Pixel"],
    url: "http://localhost:3333",
  },
  {
    name: "Blok Blok Studio Website",
    status: "active",
    description: "Agency website — blokblokstudio.com",
    progress: 100,
    team: ["💻 Pixel", "🎨 Muse"],
    url: "https://blokblokstudio.com",
  },
  {
    name: "Daily Content Factory",
    status: "active",
    description: "Automated AI news content at 7am daily",
    progress: 90,
    team: ["🔍 Scout", "✍️ Rex", "📣 Hype"],
  },
  {
    name: "Agent Org Structure",
    status: "active",
    description: "28-agent team across 4 departments",
    progress: 100,
    team: ["⚡ Cortana"],
  },
  {
    name: "Lead Generation Pipeline",
    status: "planned",
    description: "Hunter → Funnel → Quill → Boost pipeline",
    progress: 0,
    team: ["🎯 Hunter", "📊 Funnel", "📝 Quill", "💰 Boost"],
  },
  {
    name: "Content Distribution",
    status: "planned",
    description: "Auto-post to X, Threads, IG, LinkedIn",
    progress: 10,
    team: ["📣 Hype", "🚀 Nova"],
  },
];

const statusConfig: Record<string, { bg: string; text: string }> = {
  active: { bg: "bg-green-500/20", text: "text-green-400" },
  planned: { bg: "bg-blue-500/20", text: "text-blue-400" },
  paused: { bg: "bg-amber-500/20", text: "text-amber-400" },
  completed: { bg: "bg-zinc-500/20", text: "text-zinc-400" },
};

export default function ProjectsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-zinc-400 mt-1">Active projects and progress</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition-colors text-sm">
          <Plus size={16} />
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => {
          const status = statusConfig[project.status] ?? statusConfig.planned;
          return (
            <div
              key={project.name}
              className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <FolderOpen size={20} className="text-amber-400 flex-shrink-0" />
                <h3 className="font-semibold flex-1">{project.name}</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}>
                  {project.status}
                </span>
                {project.url && (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-zinc-400">
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
              <p className="text-sm text-zinc-400 mb-3">{project.description}</p>

              {/* Team */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {project.team.map((member) => (
                  <span key={member} className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                    {member}
                  </span>
                ))}
              </div>

              {/* Progress */}
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <p className="text-[10px] text-zinc-600 mt-1">{project.progress}% complete</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
