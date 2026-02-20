"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect, useCallback, useRef } from "react";
import { Search, Brain, ClipboardList, Film, FileText, X } from "lucide-react";
import { useRouter } from "next/navigation";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const memoryResults = useQuery(
    api.memories.search,
    query.length > 2 ? { query } : "skip"
  );
  const tasks = useQuery(api.tasks.list, {});
  const content = useQuery(api.content.list, {});

  // Filter tasks and content locally
  const taskResults = query.length > 2
    ? (tasks ?? []).filter(
        (t) =>
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          t.description?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const contentResults = query.length > 2
    ? (content ?? []).filter(
        (c) =>
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.description?.toLowerCase().includes(query.toLowerCase()) ||
          c.script?.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    },
    []
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [open]);

  if (!open) return null;

  const hasResults =
    (memoryResults?.length ?? 0) > 0 ||
    taskResults.length > 0 ||
    contentResults.length > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Palette */}
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
          <Search size={18} className="text-zinc-500 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search memories, tasks, content..."
            className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
          />
          <button
            onClick={() => setOpen(false)}
            className="text-zinc-500 hover:text-zinc-300"
          >
            <X size={16} />
          </button>
          <kbd className="text-[10px] text-zinc-600 border border-zinc-700 rounded px-1.5 py-0.5">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto">
          {query.length <= 2 && (
            <div className="p-8 text-center text-zinc-600 text-sm">
              Type at least 3 characters to search across all your data
            </div>
          )}

          {query.length > 2 && !hasResults && (
            <div className="p-8 text-center text-zinc-600 text-sm">
              No results found for &ldquo;{query}&rdquo;
            </div>
          )}

          {/* Memory results */}
          {(memoryResults?.length ?? 0) > 0 && (
            <div className="p-2">
              <p className="text-[10px] uppercase tracking-wider text-zinc-600 px-3 py-1.5">
                Memories
              </p>
              {memoryResults?.slice(0, 5).map((memory) => (
                <button
                  key={memory._id}
                  onClick={() => {
                    router.push("/memories");
                    setOpen(false);
                  }}
                  className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800 text-left transition-colors"
                >
                  <Brain size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{memory.title}</p>
                    <p className="text-xs text-zinc-500 line-clamp-2">
                      {memory.content}
                    </p>
                  </div>
                  <span className="text-[10px] text-zinc-600 flex-shrink-0">
                    {memory.date}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Task results */}
          {taskResults.length > 0 && (
            <div className="p-2">
              <p className="text-[10px] uppercase tracking-wider text-zinc-600 px-3 py-1.5">
                Tasks
              </p>
              {taskResults.slice(0, 5).map((task) => (
                <button
                  key={task._id}
                  onClick={() => {
                    router.push("/tasks");
                    setOpen(false);
                  }}
                  className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800 text-left transition-colors"
                >
                  <ClipboardList size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{task.title}</p>
                    {task.description && (
                      <p className="text-xs text-zinc-500 truncate">
                        {task.description}
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-600 capitalize flex-shrink-0">
                    {task.status.replace("_", " ")}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Content results */}
          {contentResults.length > 0 && (
            <div className="p-2">
              <p className="text-[10px] uppercase tracking-wider text-zinc-600 px-3 py-1.5">
                Content
              </p>
              {contentResults.slice(0, 5).map((item) => (
                <button
                  key={item._id}
                  onClick={() => {
                    router.push("/content");
                    setOpen(false);
                  }}
                  className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800 text-left transition-colors"
                >
                  <Film size={16} className="text-purple-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    {item.description && (
                      <p className="text-xs text-zinc-500 truncate">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-600 capitalize flex-shrink-0">
                    {item.stage}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-zinc-800 flex items-center gap-4 text-[10px] text-zinc-600">
          <span>
            <kbd className="border border-zinc-700 rounded px-1 py-0.5 mr-1">↑↓</kbd>
            Navigate
          </span>
          <span>
            <kbd className="border border-zinc-700 rounded px-1 py-0.5 mr-1">⏎</kbd>
            Open
          </span>
          <span>
            <kbd className="border border-zinc-700 rounded px-1 py-0.5 mr-1">⌘K</kbd>
            Toggle
          </span>
        </div>
      </div>
    </div>
  );
}
