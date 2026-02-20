"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Link from "next/link";

const statusColors: Record<string, string> = {
  backlog: "bg-zinc-700",
  todo: "bg-blue-600",
  in_progress: "bg-amber-500",
  review: "bg-purple-500",
  done: "bg-green-500",
};

const stageColors: Record<string, string> = {
  idea: "bg-blue-500",
  outline: "bg-cyan-500",
  script: "bg-amber-500",
  thumbnail: "bg-orange-500",
  filming: "bg-red-500",
  editing: "bg-purple-500",
  review: "bg-pink-500",
  published: "bg-green-500",
};

const deptColors: Record<string, string> = {
  Marketing: "text-purple-400",
  Creative: "text-pink-400",
  Engineering: "text-blue-400",
  "Client Relations": "text-green-400",
};

export default function Dashboard() {
  const tasks = useQuery(api.tasks.list, {});
  const content = useQuery(api.content.list, {});
  const agents = useQuery(api.agents.list, {});
  const memories = useQuery(api.memories.list, {});

  const activeTasks = tasks?.filter((t) => t.status !== "done") ?? [];
  const activeContent = content?.filter((c) => c.stage !== "published") ?? [];
  const workingAgents = agents?.filter((a) => a.status === "working") ?? [];
  const totalAgents = agents?.length ?? 0;

  // Group agents by department
  const departments = new Map<string, typeof agents>();
  agents?.forEach((a) => {
    const dept = a.department ?? "Other";
    if (!departments.has(dept)) departments.set(dept, []);
    departments.get(dept)!.push(a);
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-zinc-400 mt-1">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-5 gap-4">
        <StatCard
          label="Active Tasks"
          value={activeTasks.length}
          color="text-blue-400"
          href="/tasks"
        />
        <StatCard
          label="Content Pipeline"
          value={activeContent.length}
          color="text-purple-400"
          href="/content"
        />
        <StatCard
          label="Active Agents"
          value={workingAgents.length}
          total={totalAgents}
          color="text-green-400"
          href="/agents"
        />
        <StatCard
          label="Departments"
          value={departments.size}
          color="text-amber-400"
          href="/agents"
        />
        <StatCard
          label="Memories"
          value={memories?.length ?? 0}
          color="text-cyan-400"
          href="/memories"
        />
      </div>

      {/* Department Overview */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { name: "Marketing", head: "Nova", emoji: "🚀", count: 8 },
          { name: "Creative", head: "Muse", emoji: "🎨", count: 6 },
          { name: "Engineering", head: "Atlas", emoji: "⚙️", count: 10 },
          { name: "Client Relations", head: "Sage", emoji: "🤝", count: 3 },
        ].map((dept) => {
          const deptAgents = agents?.filter((a) => a.department === dept.name) ?? [];
          const working = deptAgents.filter((a) => a.status === "working").length;
          return (
            <Link
              key={dept.name}
              href="/agents"
              className="bg-zinc-900 rounded-xl border border-zinc-800 p-4 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl">{dept.emoji}</span>
                <div>
                  <p className={`text-sm font-semibold ${deptColors[dept.name]}`}>{dept.name}</p>
                  <p className="text-[10px] text-zinc-500">Led by {dept.head}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all"
                      style={{ width: deptAgents.length > 0 ? `${(working / deptAgents.length) * 100}%` : "0%" }}
                    />
                  </div>
                </div>
                <span className="text-[10px] text-zinc-500">
                  {working}/{deptAgents.length} active
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Tasks summary */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Active Tasks</h2>
            <Link href="/tasks" className="text-sm text-zinc-400 hover:text-white">
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {activeTasks.length === 0 && (
              <p className="text-zinc-500 text-sm">No active tasks</p>
            )}
            {activeTasks.slice(0, 8).map((task) => (
              <div
                key={task._id}
                className="flex items-center gap-3 py-2 px-3 rounded-lg bg-zinc-800/50"
              >
                <span
                  className={`w-2 h-2 rounded-full ${statusColors[task.status]}`}
                />
                <span className="flex-1 text-sm truncate">{task.title}</span>
                <span className="text-xs text-zinc-500 capitalize">
                  {task.assignee}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content pipeline summary */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Content Pipeline</h2>
            <Link href="/content" className="text-sm text-zinc-400 hover:text-white">
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {activeContent.length === 0 && (
              <p className="text-zinc-500 text-sm">No content in pipeline</p>
            )}
            {activeContent.slice(0, 8).map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-3 py-2 px-3 rounded-lg bg-zinc-800/50"
              >
                <span
                  className={`w-2 h-2 rounded-full ${stageColors[item.stage]}`}
                />
                <span className="flex-1 text-sm truncate">{item.title}</span>
                <span className="text-xs text-zinc-500 capitalize">
                  {item.stage.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Working Agents */}
      {workingAgents.length > 0 && (
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">🔥 Agents Working Now</h2>
            <Link href="/office" className="text-sm text-zinc-400 hover:text-white">
              View office →
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {workingAgents.map((agent) => (
              <div
                key={agent._id}
                className="flex items-center gap-3 py-2 px-3 rounded-lg bg-zinc-800/50"
              >
                <span className="text-base">{agent.emoji ?? "🤖"}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{agent.name}</p>
                  <p className="text-[10px] text-amber-400 truncate">
                    {agent.currentTask ?? "Working..."}
                  </p>
                </div>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Memories */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Memories</h2>
          <Link href="/memories" className="text-sm text-zinc-400 hover:text-white">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {(memories ?? []).slice(0, 6).map((memory) => (
            <div
              key={memory._id}
              className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700/50"
            >
              <p className="text-sm font-medium truncate">{memory.title}</p>
              <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                {memory.content}
              </p>
              <p className="text-xs text-zinc-600 mt-2">{memory.date}</p>
            </div>
          ))}
          {(memories ?? []).length === 0 && (
            <p className="text-zinc-500 text-sm col-span-3">No memories yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  total,
  color,
  href,
}: {
  label: string;
  value: number;
  total?: number;
  color: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 hover:border-zinc-700 transition-colors"
    >
      <p className="text-sm text-zinc-400">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>
        {value}
        {total !== undefined && (
          <span className="text-lg text-zinc-600">/{total}</span>
        )}
      </p>
    </Link>
  );
}
