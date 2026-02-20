"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  Search,
  Brain,
  ClipboardList,
  Film,
  X,
  Users,
  Plus,
  ArrowRight,
  LayoutDashboard,
  CheckSquare,
  Video,
  Shield,
  Calendar,
  FolderOpen,
  BookOpen,
  FileText,
  MessageSquare,
  Building2,
  UserCircle,
  Sparkles,
  Command,
  Hash,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";

// --- Types ---

type Mode = "search" | "create-task";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  keywords: string[];
}

// --- Constants ---

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/", icon: <LayoutDashboard size={16} />, keywords: ["home", "overview", "main"] },
  { label: "Tasks", path: "/tasks", icon: <CheckSquare size={16} />, keywords: ["todo", "tickets", "work"] },
  { label: "Content", path: "/content", icon: <Video size={16} />, keywords: ["videos", "scripts", "media"] },
  { label: "Approvals", path: "/approvals", icon: <Shield size={16} />, keywords: ["review", "approve", "pending"] },
  { label: "Council", path: "/council", icon: <Users size={16} />, keywords: ["meeting", "decisions", "votes"] },
  { label: "Calendar", path: "/calendar", icon: <Calendar size={16} />, keywords: ["schedule", "events", "dates"] },
  { label: "Projects", path: "/projects", icon: <FolderOpen size={16} />, keywords: ["repos", "initiatives"] },
  { label: "Memories", path: "/memories", icon: <Brain size={16} />, keywords: ["knowledge", "notes", "recall"] },
  { label: "Feedback", path: "/feedback", icon: <MessageSquare size={16} />, keywords: ["bugs", "requests", "suggestions"] },
  { label: "Docs", path: "/docs", icon: <FileText size={16} />, keywords: ["documentation", "guides", "wiki"] },
  { label: "Team", path: "/team", icon: <UserCircle size={16} />, keywords: ["people", "staff", "members"] },
  { label: "Office", path: "/office", icon: <Building2 size={16} />, keywords: ["workspace", "space"] },
  { label: "Agents", path: "/agents", icon: <Sparkles size={16} />, keywords: ["ai", "bots", "automation"] },
];

const SHORTCUTS = [
  { keys: "⌘K", description: "Command palette" },
  { keys: "⌘T", description: "Quick create task" },
];

// --- Helpers ---

function fuzzyMatch(text: string, query: string): boolean {
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  if (lower.includes(q)) return true;
  // simple fuzzy: all chars in order
  let qi = 0;
  for (let i = 0; i < lower.length && qi < q.length; i++) {
    if (lower[i] === q[qi]) qi++;
  }
  return qi === q.length;
}

// --- Component ---

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<Mode>("search");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [taskTitle, setTaskTitle] = useState("");
  const [recentActions, setRecentActions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Convex queries
  const memoryResults = useQuery(
    api.memories.search,
    query.length > 2 && mode === "search" ? { query } : "skip"
  );
  const tasks = useQuery(api.tasks.list, {});
  const content = useQuery(api.content.list, {});
  const agents = useQuery(api.agents.list, {});
  const createTask = useMutation(api.tasks.create);

  // --- Detect "create task:" prefix ---
  const isCreateCommand = query.toLowerCase().startsWith("create task:");
  const createTaskTitle = isCreateCommand ? query.slice(12).trim() : "";

  // --- Filtered results ---
  const filteredNav = useMemo(() => {
    if (query.length === 0) return NAV_ITEMS;
    return NAV_ITEMS.filter(
      (item) =>
        fuzzyMatch(item.label, query) ||
        item.keywords.some((k) => fuzzyMatch(k, query))
    );
  }, [query]);

  const agentResults = useMemo(() => {
    if (query.length < 2 || !agents) return [];
    return agents.filter(
      (a) =>
        fuzzyMatch(a.name, query) ||
        fuzzyMatch(a.role, query) ||
        (a.department && fuzzyMatch(a.department, query))
    ).slice(0, 6);
  }, [query, agents]);

  const taskResults = useMemo(() => {
    if (query.length < 3) return [];
    return (tasks ?? [])
      .filter(
        (t) =>
          fuzzyMatch(t.title, query) ||
          (t.description && fuzzyMatch(t.description, query))
      )
      .slice(0, 5);
  }, [query, tasks]);

  const contentResults = useMemo(() => {
    if (query.length < 3) return [];
    return (content ?? [])
      .filter(
        (c) =>
          fuzzyMatch(c.title, query) ||
          (c.description && fuzzyMatch(c.description, query))
      )
      .slice(0, 5);
  }, [query, content]);

  // Build flat list of all selectable items for keyboard nav
  const allItems = useMemo(() => {
    const items: { type: string; id: string; action: () => void }[] = [];

    if (isCreateCommand && createTaskTitle) {
      items.push({
        type: "create",
        id: "create-task",
        action: () => handleCreateTask(createTaskTitle),
      });
    }

    filteredNav.forEach((nav) => {
      items.push({
        type: "nav",
        id: nav.path,
        action: () => { router.push(nav.path); close(); },
      });
    });

    agentResults.forEach((a) => {
      items.push({
        type: "agent",
        id: a._id,
        action: () => { router.push("/agents"); close(); },
      });
    });

    taskResults.forEach((t) => {
      items.push({
        type: "task",
        id: t._id,
        action: () => { router.push("/tasks"); close(); },
      });
    });

    contentResults.forEach((c) => {
      items.push({
        type: "content",
        id: c._id,
        action: () => { router.push("/content"); close(); },
      });
    });

    (memoryResults ?? []).slice(0, 5).forEach((m) => {
      items.push({
        type: "memory",
        id: m._id,
        action: () => { router.push("/memories"); close(); },
      });
    });

    return items;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredNav, agentResults, taskResults, contentResults, memoryResults, isCreateCommand, createTaskTitle]);

  // --- Actions ---

  function close() {
    setOpen(false);
    setMode("search");
  }

  async function handleCreateTask(title: string) {
    if (!title.trim()) return;
    try {
      await createTask({
        title: title.trim(),
        status: "todo",
        assignee: "Cortana",
        priority: "medium",
      });
      addRecentAction(`Created task: ${title.trim()}`);
      close();
    } catch (e) {
      console.error("Failed to create task:", e);
    }
  }

  function addRecentAction(action: string) {
    setRecentActions((prev) => [action, ...prev].slice(0, 5));
  }

  // --- Keyboard handling ---

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // ⌘K — toggle palette
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => {
          if (!prev) setMode("search");
          return !prev;
        });
      }
      // ⌘T — quick create task
      if ((e.metaKey || e.ctrlKey) && e.key === "t") {
        e.preventDefault();
        setOpen(true);
        setMode("create-task");
        setQuery("");
      }
      if (e.key === "Escape") {
        close();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleInternalKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, allItems.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (mode === "create-task" && taskTitle.trim()) {
          handleCreateTask(taskTitle);
        } else if (allItems[selectedIndex]) {
          allItems[selectedIndex].action();
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [allItems, selectedIndex, mode, taskTitle]
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
      setTaskTitle("");
      setSelectedIndex(0);
    }
  }, [open]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll selected item into view
  useEffect(() => {
    if (resultsRef.current) {
      const el = resultsRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  if (!open) return null;

  // --- Render helpers ---

  let itemIndex = -1;
  function nextIndex() {
    itemIndex++;
    return itemIndex;
  }

  function itemClass(idx: number) {
    return `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
      idx === selectedIndex ? "bg-zinc-800 text-white" : "hover:bg-zinc-800/50 text-zinc-300"
    }`;
  }

  const hasResults = filteredNav.length > 0 || agentResults.length > 0 ||
    taskResults.length > 0 || contentResults.length > 0 ||
    (memoryResults?.length ?? 0) > 0 || isCreateCommand;

  // --- Create Task Mode ---
  if (mode === "create-task") {
    return (
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
        <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
            <Plus size={18} className="text-emerald-400 flex-shrink-0" />
            <input
              ref={inputRef}
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && taskTitle.trim()) handleCreateTask(taskTitle);
                if (e.key === "Escape") close();
              }}
              placeholder="Task title... (Enter to create)"
              className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
            />
            <button onClick={close} className="text-zinc-500 hover:text-zinc-300">
              <X size={16} />
            </button>
          </div>
          <div className="px-4 py-6 text-center text-zinc-500 text-sm">
            <p>Quick create a task — it&apos;ll be added to <span className="text-emerald-400">Todo</span> with <span className="text-amber-400">Medium</span> priority</p>
            <p className="text-xs text-zinc-600 mt-2">Press Enter to create, Escape to cancel</p>
          </div>
          <div className="px-4 py-2 border-t border-zinc-800 flex items-center gap-4 text-[10px] text-zinc-600">
            <span><kbd className="border border-zinc-700 rounded px-1 py-0.5 mr-1">⏎</kbd> Create</span>
            <span><kbd className="border border-zinc-700 rounded px-1 py-0.5 mr-1">ESC</kbd> Cancel</span>
            <span><kbd className="border border-zinc-700 rounded px-1 py-0.5 mr-1">⌘K</kbd> Search mode</span>
          </div>
        </div>
      </div>
    );
  }

  // --- Search Mode (default) ---
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
      <div
        className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl overflow-hidden"
        onKeyDown={handleInternalKeyDown}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
          <Search size={18} className="text-zinc-500 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search, navigate, or type 'create task: ...' "
            className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
          />
          <button onClick={close} className="text-zinc-500 hover:text-zinc-300">
            <X size={16} />
          </button>
          <kbd className="text-[10px] text-zinc-600 border border-zinc-700 rounded px-1.5 py-0.5">ESC</kbd>
        </div>

        {/* Results */}
        <div ref={resultsRef} className="max-h-[50vh] overflow-y-auto">
          {/* Empty state — show shortcuts + recent */}
          {query.length === 0 && (
            <div className="p-2">
              {/* Recent actions */}
              {recentActions.length > 0 && (
                <>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-600 px-3 py-1.5 flex items-center gap-1.5">
                    <Clock size={10} /> Recent
                  </p>
                  {recentActions.map((action, i) => (
                    <div key={i} className="px-3 py-2 text-xs text-zinc-500 flex items-center gap-2">
                      <ArrowRight size={12} className="text-zinc-600" />
                      {action}
                    </div>
                  ))}
                </>
              )}

              {/* Quick navigation */}
              <p className="text-[10px] uppercase tracking-wider text-zinc-600 px-3 py-1.5 flex items-center gap-1.5">
                <Command size={10} /> Navigate
              </p>
              {filteredNav.map((nav) => {
                const idx = nextIndex();
                return (
                  <button
                    key={nav.path}
                    data-index={idx}
                    onClick={() => { router.push(nav.path); close(); }}
                    className={itemClass(idx)}
                  >
                    <span className="text-zinc-400">{nav.icon}</span>
                    <span className="flex-1 text-sm">{nav.label}</span>
                    <ArrowRight size={12} className="text-zinc-600" />
                  </button>
                );
              })}

              {/* Shortcuts hint */}
              <p className="text-[10px] uppercase tracking-wider text-zinc-600 px-3 pt-3 pb-1.5 flex items-center gap-1.5">
                <Hash size={10} /> Shortcuts
              </p>
              {SHORTCUTS.map((s) => (
                <div key={s.keys} className="px-3 py-1.5 flex items-center gap-3 text-xs text-zinc-500">
                  <kbd className="text-[10px] border border-zinc-700 rounded px-1.5 py-0.5 text-zinc-400 min-w-[36px] text-center">{s.keys}</kbd>
                  {s.description}
                </div>
              ))}
            </div>
          )}

          {/* Create task command */}
          {isCreateCommand && createTaskTitle && (
            <div className="p-2">
              <p className="text-[10px] uppercase tracking-wider text-zinc-600 px-3 py-1.5 flex items-center gap-1.5">
                <Plus size={10} /> Quick Create
              </p>
              {(() => { const idx = nextIndex(); return (
                <button
                  data-index={idx}
                  onClick={() => handleCreateTask(createTaskTitle)}
                  className={itemClass(idx)}
                >
                  <Plus size={16} className="text-emerald-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Create task: <span className="text-emerald-400">{createTaskTitle}</span></p>
                    <p className="text-xs text-zinc-500">Add to Todo · Medium priority</p>
                  </div>
                  <kbd className="text-[10px] border border-zinc-700 rounded px-1.5 py-0.5 text-zinc-500">⏎</kbd>
                </button>
              ); })()}
            </div>
          )}

          {/* Navigation results */}
          {query.length > 0 && filteredNav.length > 0 && !isCreateCommand && (
            <div className="p-2">
              <p className="text-[10px] uppercase tracking-wider text-zinc-600 px-3 py-1.5">Pages</p>
              {filteredNav.slice(0, 5).map((nav) => {
                const idx = nextIndex();
                return (
                  <button
                    key={nav.path}
                    data-index={idx}
                    onClick={() => { router.push(nav.path); close(); }}
                    className={itemClass(idx)}
                  >
                    <span className="text-zinc-400">{nav.icon}</span>
                    <span className="flex-1 text-sm">{nav.label}</span>
                    <ArrowRight size={12} className="text-zinc-600" />
                  </button>
                );
              })}
            </div>
          )}

          {/* Agent results */}
          {agentResults.length > 0 && (
            <div className="p-2">
              <p className="text-[10px] uppercase tracking-wider text-zinc-600 px-3 py-1.5 flex items-center gap-1.5">
                <Sparkles size={10} /> Agents
              </p>
              {agentResults.map((agent) => {
                const idx = nextIndex();
                return (
                  <button
                    key={agent._id}
                    data-index={idx}
                    onClick={() => { router.push("/agents"); close(); }}
                    className={itemClass(idx)}
                  >
                    <span className="text-lg flex-shrink-0">{agent.emoji || "🤖"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{agent.name}</p>
                      <p className="text-xs text-zinc-500 truncate">{agent.role}</p>
                    </div>
                    {agent.department && (
                      <span className="text-[10px] bg-zinc-800 text-zinc-400 rounded-full px-2 py-0.5">{agent.department}</span>
                    )}
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      agent.status === "working" ? "bg-emerald-400" : agent.status === "idle" ? "bg-amber-400" : "bg-zinc-600"
                    }`} />
                  </button>
                );
              })}
            </div>
          )}

          {/* Task results */}
          {taskResults.length > 0 && (
            <div className="p-2">
              <p className="text-[10px] uppercase tracking-wider text-zinc-600 px-3 py-1.5">Tasks</p>
              {taskResults.map((task) => {
                const idx = nextIndex();
                return (
                  <button
                    key={task._id}
                    data-index={idx}
                    onClick={() => { router.push("/tasks"); close(); }}
                    className={itemClass(idx)}
                  >
                    <ClipboardList size={16} className="text-blue-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{task.title}</p>
                      {task.description && <p className="text-xs text-zinc-500 truncate">{task.description}</p>}
                    </div>
                    <span className="text-[10px] text-zinc-600 capitalize">{task.status.replace("_", " ")}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Content results */}
          {contentResults.length > 0 && (
            <div className="p-2">
              <p className="text-[10px] uppercase tracking-wider text-zinc-600 px-3 py-1.5">Content</p>
              {contentResults.map((item) => {
                const idx = nextIndex();
                return (
                  <button
                    key={item._id}
                    data-index={idx}
                    onClick={() => { router.push("/content"); close(); }}
                    className={itemClass(idx)}
                  >
                    <Film size={16} className="text-purple-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      {item.description && <p className="text-xs text-zinc-500 truncate">{item.description}</p>}
                    </div>
                    <span className="text-[10px] text-zinc-600 capitalize">{item.stage}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Memory results */}
          {(memoryResults?.length ?? 0) > 0 && (
            <div className="p-2">
              <p className="text-[10px] uppercase tracking-wider text-zinc-600 px-3 py-1.5">Memories</p>
              {memoryResults?.slice(0, 5).map((memory) => {
                const idx = nextIndex();
                return (
                  <button
                    key={memory._id}
                    data-index={idx}
                    onClick={() => { router.push("/memories"); close(); }}
                    className={itemClass(idx)}
                  >
                    <Brain size={16} className="text-amber-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{memory.title}</p>
                      <p className="text-xs text-zinc-500 line-clamp-2">{memory.content}</p>
                    </div>
                    <span className="text-[10px] text-zinc-600">{memory.date}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* No results */}
          {query.length > 2 && !hasResults && (
            <div className="p-8 text-center text-zinc-600 text-sm">
              No results for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-zinc-800 flex items-center gap-4 text-[10px] text-zinc-600">
          <span><kbd className="border border-zinc-700 rounded px-1 py-0.5 mr-1">↑↓</kbd> Navigate</span>
          <span><kbd className="border border-zinc-700 rounded px-1 py-0.5 mr-1">⏎</kbd> Open</span>
          <span><kbd className="border border-zinc-700 rounded px-1 py-0.5 mr-1">⌘K</kbd> Toggle</span>
          <span><kbd className="border border-zinc-700 rounded px-1 py-0.5 mr-1">⌘T</kbd> New task</span>
          <span className="ml-auto text-zinc-700">type &quot;create task:&quot; to quick-add</span>
        </div>
      </div>
    </div>
  );
}
