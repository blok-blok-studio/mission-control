"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import { Id } from "../../../convex/_generated/dataModel";

const stages = [
  { key: "idea" as const, label: "💡 Ideas", color: "border-blue-500" },
  { key: "outline" as const, label: "📝 Outline", color: "border-cyan-500" },
  { key: "script" as const, label: "✍️ Script", color: "border-amber-500" },
  { key: "thumbnail" as const, label: "🎨 Thumbnail", color: "border-orange-500" },
  { key: "filming" as const, label: "🎬 Filming", color: "border-red-500" },
  { key: "editing" as const, label: "✂️ Editing", color: "border-purple-500" },
  { key: "review" as const, label: "👀 Review", color: "border-pink-500" },
  { key: "published" as const, label: "✅ Published", color: "border-green-500" },
];

const platformEmoji: Record<string, string> = {
  youtube: "📺",
  tiktok: "🎵",
  instagram: "📸",
  twitter: "𝕏",
  linkedin: "💼",
  blog: "📝",
  other: "📎",
};

export default function ContentPage() {
  const content = useQuery(api.content.list, {});
  const createContent = useMutation(api.content.create);
  const updateContent = useMutation(api.content.update);
  const deleteContent = useMutation(api.content.remove);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<Id<"content"> | null>(null);
  const [draggedItem, setDraggedItem] = useState<Id<"content"> | null>(null);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await createContent({
      title: form.get("title") as string,
      description: (form.get("description") as string) || undefined,
      stage: "idea",
      platform: (form.get("platform") as "youtube" | "tiktok" | "instagram" | "twitter" | "linkedin" | "blog" | "other") || undefined,
      notes: (form.get("notes") as string) || undefined,
    });
    setShowForm(false);
  };

  const handleDrop = (stage: typeof stages[number]["key"]) => {
    if (draggedItem) {
      updateContent({ id: draggedItem, stage });
      setDraggedItem(null);
    }
  };

  return (
    <div className="max-w-full mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Pipeline</h1>
          <p className="text-zinc-400 mt-1">Track content from idea to published</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition-colors"
        >
          + New Content
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 grid grid-cols-2 gap-4"
        >
          <input
            name="title"
            placeholder="Content title / idea"
            required
            className="col-span-2 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-amber-500"
          />
          <textarea
            name="description"
            placeholder="Brief description"
            rows={2}
            className="col-span-2 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-amber-500"
          />
          <select
            name="platform"
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm"
          >
            <option value="">Platform...</option>
            <option value="youtube">📺 YouTube</option>
            <option value="tiktok">🎵 TikTok</option>
            <option value="instagram">📸 Instagram</option>
            <option value="twitter">𝕏 Twitter</option>
            <option value="linkedin">💼 LinkedIn</option>
            <option value="blog">📝 Blog</option>
            <option value="other">📎 Other</option>
          </select>
          <textarea
            name="notes"
            placeholder="Notes"
            rows={1}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-amber-500"
          />
          <div className="col-span-2 flex gap-2 justify-end">
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
              Add to Ideas
            </button>
          </div>
        </form>
      )}

      <div className="flex gap-3 overflow-x-auto pb-4">
        {stages.map((stage) => (
          <div
            key={stage.key}
            className={`min-w-[220px] flex-shrink-0 bg-zinc-900/50 rounded-xl border-t-2 ${stage.color} p-3`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(stage.key)}
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-xs font-semibold text-zinc-300">{stage.label}</h3>
              <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
                {content?.filter((c) => c.stage === stage.key).length ?? 0}
              </span>
            </div>
            <div className="space-y-2">
              {content
                ?.filter((c) => c.stage === stage.key)
                .map((item) => (
                  <div
                    key={item._id}
                    draggable
                    onDragStart={() => setDraggedItem(item._id)}
                    onClick={() =>
                      setExpandedId(expandedId === item._id ? null : item._id)
                    }
                    className="bg-zinc-800 rounded-lg p-3 cursor-grab active:cursor-grabbing hover:bg-zinc-750 border border-zinc-700/50 hover:border-zinc-600 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium">{item.title}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteContent({ id: item._id });
                        }}
                        className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                      >
                        ✕
                      </button>
                    </div>
                    {item.platform && (
                      <span className="text-xs text-zinc-500">
                        {platformEmoji[item.platform] ?? ""} {item.platform}
                      </span>
                    )}
                    {expandedId === item._id && (
                      <div className="mt-2 space-y-1 border-t border-zinc-700 pt-2">
                        {item.description && (
                          <p className="text-xs text-zinc-400">{item.description}</p>
                        )}
                        {item.notes && (
                          <p className="text-xs text-zinc-500 italic">{item.notes}</p>
                        )}
                        {item.script && (
                          <p className="text-xs text-zinc-400 bg-zinc-900 p-2 rounded max-h-32 overflow-y-auto whitespace-pre-wrap">
                            {item.script}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
