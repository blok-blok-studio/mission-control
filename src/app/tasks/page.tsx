"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";

const columns = [
  { key: "backlog" as const, label: "Backlog", color: "border-zinc-600" },
  { key: "todo" as const, label: "To Do", color: "border-blue-500" },
  { key: "in_progress" as const, label: "In Progress", color: "border-amber-500" },
  { key: "review" as const, label: "Review", color: "border-purple-500" },
  { key: "done" as const, label: "Done", color: "border-green-500" },
];

const priorityColors: Record<string, string> = {
  low: "bg-zinc-600",
  medium: "bg-blue-600",
  high: "bg-orange-500",
  urgent: "bg-red-500",
};

const assigneeOptions = [
  { value: "chase", label: "👤 Chase" },
  { value: "cortana", label: "⚡ Cortana" },
  { value: "nova", label: "🚀 Nova" },
  { value: "muse", label: "🎨 Muse" },
  { value: "atlas", label: "⚙️ Atlas" },
  { value: "sage", label: "🤝 Sage" },
  { value: "scout", label: "🔍 Scout" },
  { value: "rex", label: "✍️ Rex" },
  { value: "hype", label: "📣 Hype" },
  { value: "hunter", label: "🎯 Hunter" },
  { value: "funnel", label: "📊 Funnel" },
  { value: "quill", label: "📝 Quill" },
  { value: "boost", label: "💰 Boost" },
  { value: "palette", label: "🎭 Palette" },
  { value: "blueprint", label: "📐 Blueprint" },
  { value: "canvas", label: "🖼️ Canvas" },
  { value: "spark", label: "✨ Spark" },
  { value: "motion", label: "🎬 Motion" },
  { value: "pixel", label: "💻 Pixel" },
  { value: "forge", label: "🔨 Forge" },
  { value: "flow", label: "🔄 Flow" },
  { value: "integrator", label: "🧠 Integrator" },
  { value: "chatbot", label: "💬 Chatbot" },
  { value: "voice", label: "🎙️ Voice" },
  { value: "dash", label: "📈 Dash" },
  { value: "sentry", label: "🛡️ Sentry" },
  { value: "shield", label: "🔒 Shield" },
  { value: "reporter", label: "📋 Reporter" },
  { value: "listener", label: "👂 Listener" },
];

const assigneeEmoji: Record<string, string> = Object.fromEntries(
  assigneeOptions.map((a) => [a.value, a.label.split(" ")[0]])
);

export default function TasksPage() {
  const tasks = useQuery(api.tasks.list, {});
  const createTask = useMutation(api.tasks.create);
  const updateTask = useMutation(api.tasks.update);
  const deleteTask = useMutation(api.tasks.remove);
  const [showForm, setShowForm] = useState(false);
  const [draggedTask, setDraggedTask] = useState<Id<"tasks"> | null>(null);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await createTask({
      title: form.get("title") as string,
      description: (form.get("description") as string) || undefined,
      status: "todo",
      assignee: form.get("assignee") as string,
      priority: form.get("priority") as "low" | "medium" | "high" | "urgent",
      project: (form.get("project") as string) || undefined,
    });
    setShowForm(false);
  };

  const handleDrop = (status: typeof columns[number]["key"]) => {
    if (draggedTask) {
      updateTask({ id: draggedTask, status });
      setDraggedTask(null);
    }
  };

  return (
    <div className="max-w-full mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks Board</h1>
          <p className="text-zinc-400 mt-1">Drag cards between columns to update status</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition-colors"
        >
          + New Task
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 grid grid-cols-2 gap-4"
        >
          <input
            name="title"
            placeholder="Task title"
            required
            className="col-span-2 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-amber-500"
          />
          <textarea
            name="description"
            placeholder="Description (optional)"
            rows={2}
            className="col-span-2 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-amber-500"
          />
          <select
            name="assignee"
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm"
          >
            <optgroup label="Leadership">
              {assigneeOptions.slice(0, 6).map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </optgroup>
            <optgroup label="Marketing">
              {assigneeOptions.slice(6, 13).map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </optgroup>
            <optgroup label="Creative">
              {assigneeOptions.slice(13, 18).map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </optgroup>
            <optgroup label="Engineering">
              {assigneeOptions.slice(18, 27).map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </optgroup>
            <optgroup label="Client Relations">
              {assigneeOptions.slice(27).map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </optgroup>
          </select>
          <select
            name="priority"
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm"
          >
            <option value="medium">Medium</option>
            <option value="low">Low</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          <input
            name="project"
            placeholder="Project (optional)"
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-amber-500"
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 text-black font-medium rounded-lg text-sm hover:bg-amber-400"
            >
              Create
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-5 gap-4 min-h-[70vh]">
        {columns.map((col) => (
          <div
            key={col.key}
            className={`bg-zinc-900/50 rounded-xl border-t-2 ${col.color} p-3`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(col.key)}
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm font-semibold text-zinc-300">{col.label}</h3>
              <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
                {tasks?.filter((t) => t.status === col.key).length ?? 0}
              </span>
            </div>
            <div className="space-y-2">
              {tasks
                ?.filter((t) => t.status === col.key)
                .sort((a, b) => {
                  const pOrder: Record<string, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
                  return (pOrder[a.priority] ?? 2) - (pOrder[b.priority] ?? 2);
                })
                .map((task) => (
                  <div
                    key={task._id}
                    draggable
                    onDragStart={() => setDraggedTask(task._id)}
                    className="bg-zinc-800 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:bg-zinc-750 border border-zinc-700/50 hover:border-zinc-600 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium">{task.title}</p>
                      <button
                        onClick={() => deleteTask({ id: task._id })}
                        className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                      >
                        ✕
                      </button>
                    </div>
                    {task.description && (
                      <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded ${priorityColors[task.priority]} text-white`}
                      >
                        {task.priority}
                      </span>
                      <span className="text-xs text-zinc-500" title={task.assignee}>
                        {assigneeEmoji[task.assignee] ?? "🤖"}
                      </span>
                      <span className="text-[10px] text-zinc-600 capitalize">
                        {task.assignee}
                      </span>
                      {task.project && (
                        <span className="text-[10px] text-zinc-600 ml-auto">
                          {task.project}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
