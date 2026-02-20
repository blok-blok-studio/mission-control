"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";

const categoryColors: Record<string, string> = {
  decision: "bg-blue-500/20 text-blue-300",
  preference: "bg-purple-500/20 text-purple-300",
  project: "bg-amber-500/20 text-amber-300",
  insight: "bg-green-500/20 text-green-300",
  conversation: "bg-cyan-500/20 text-cyan-300",
  daily: "bg-zinc-500/20 text-zinc-300",
  other: "bg-zinc-600/20 text-zinc-400",
};

const categoryEmoji: Record<string, string> = {
  decision: "⚖️",
  preference: "💜",
  project: "🔨",
  insight: "💡",
  conversation: "💬",
  daily: "📅",
  other: "📎",
};

export default function MemoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const allMemories = useQuery(api.memories.list, 
    selectedCategory ? { category: selectedCategory as "decision" | "preference" | "project" | "insight" | "conversation" | "daily" | "other" } : {}
  );
  const searchResults = useQuery(
    api.memories.search,
    searchQuery.length > 2 ? { query: searchQuery } : "skip"
  );
  const createMemory = useMutation(api.memories.create);
  const deleteMemory = useMutation(api.memories.remove);

  const memories = searchQuery.length > 2 ? searchResults : allMemories;

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await createMemory({
      title: form.get("title") as string,
      content: form.get("content") as string,
      category: form.get("category") as "decision" | "preference" | "project" | "insight" | "conversation" | "daily" | "other",
      date: new Date().toISOString().split("T")[0],
      tags: (form.get("tags") as string)
        ?.split(",")
        .map((t) => t.trim())
        .filter(Boolean) || undefined,
    });
    setShowForm(false);
  };

  const categories = ["decision", "preference", "project", "insight", "conversation", "daily", "other"];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Memory</h1>
          <p className="text-zinc-400 mt-1">Everything Cortana remembers</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition-colors"
        >
          + Add Memory
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search memories..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-amber-500 pl-10"
        />
        <span className="absolute left-3.5 top-3.5 text-zinc-500">🔍</span>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            !selectedCategory
              ? "bg-amber-500/20 text-amber-300"
              : "bg-zinc-800 text-zinc-400 hover:text-white"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() =>
              setSelectedCategory(selectedCategory === cat ? null : cat)
            }
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
              selectedCategory === cat
                ? categoryColors[cat]
                : "bg-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            {categoryEmoji[cat]} {cat}
          </button>
        ))}
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4"
        >
          <input
            name="title"
            placeholder="Memory title"
            required
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-amber-500"
          />
          <textarea
            name="content"
            placeholder="What happened? What's worth remembering?"
            required
            rows={4}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-amber-500"
          />
          <div className="grid grid-cols-2 gap-4">
            <select
              name="category"
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {categoryEmoji[cat]} {cat}
                </option>
              ))}
            </select>
            <input
              name="tags"
              placeholder="Tags (comma-separated)"
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
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
              Save Memory
            </button>
          </div>
        </form>
      )}

      {/* Memory cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(memories ?? []).map((memory) => (
          <div
            key={memory._id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors group"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold">{memory.title}</h3>
              <button
                onClick={() => deleteMemory({ id: memory._id })}
                className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs flex-shrink-0"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-zinc-400 mt-2 line-clamp-4 whitespace-pre-wrap">
              {memory.content}
            </p>
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${categoryColors[memory.category]}`}
              >
                {memory.category}
              </span>
              {memory.tags?.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500"
                >
                  #{tag}
                </span>
              ))}
              <span className="text-[10px] text-zinc-600 ml-auto">
                {memory.date}
              </span>
            </div>
          </div>
        ))}
        {(memories ?? []).length === 0 && (
          <p className="text-zinc-500 text-sm col-span-3">
            {searchQuery.length > 2 ? "No memories match your search" : "No memories yet. Start building your knowledge base!"}
          </p>
        )}
      </div>
    </div>
  );
}
