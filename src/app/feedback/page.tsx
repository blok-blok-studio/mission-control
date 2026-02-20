"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";

const sentimentColors = {
  positive: "bg-green-500/20 text-green-300",
  neutral: "bg-zinc-500/20 text-zinc-300",
  negative: "bg-red-500/20 text-red-300",
};

const sentimentEmoji = {
  positive: "😊",
  neutral: "😐",
  negative: "😤",
};

const statusColors = {
  new: "bg-blue-500",
  reviewed: "bg-amber-500",
  actioned: "bg-green-500",
  archived: "bg-zinc-600",
};

const sourceEmoji: Record<string, string> = {
  email: "📧",
  call: "📞",
  chat: "💬",
  form: "📝",
  other: "📎",
};

export default function FeedbackPage() {
  const feedback = useQuery(api.feedback.list, {});
  const createFeedback = useMutation(api.feedback.create);
  const updateFeedback = useMutation(api.feedback.update);
  const deleteFeedback = useMutation(api.feedback.remove);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);

  const filtered = filter
    ? (feedback ?? []).filter((f) => f.status === filter)
    : feedback ?? [];

  const newCount = (feedback ?? []).filter((f) => f.status === "new").length;

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await createFeedback({
      client: form.get("client") as string,
      content: form.get("content") as string,
      source: form.get("source") as "email" | "call" | "chat" | "form" | "other",
      sentiment: (form.get("sentiment") as "positive" | "neutral" | "negative") || undefined,
      date: new Date().toISOString().split("T")[0],
    });
    setShowForm(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Client Feedback
            {newCount > 0 && (
              <span className="ml-3 text-sm bg-blue-500 text-white px-2.5 py-1 rounded-full align-middle">
                {newCount} new
              </span>
            )}
          </h1>
          <p className="text-zinc-400 mt-1">Track and act on client feedback</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition-colors"
        >
          + Add Feedback
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[null, "new", "reviewed", "actioned", "archived"].map((s) => (
          <button
            key={s ?? "all"}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
              filter === s
                ? "bg-amber-500/20 text-amber-300"
                : "bg-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            {s ?? "All"}
          </button>
        ))}
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4"
        >
          <div className="grid grid-cols-3 gap-4">
            <input
              name="client"
              placeholder="Client name"
              required
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-amber-500"
            />
            <select
              name="source"
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm"
            >
              <option value="email">📧 Email</option>
              <option value="call">📞 Call</option>
              <option value="chat">💬 Chat</option>
              <option value="form">📝 Form</option>
              <option value="other">📎 Other</option>
            </select>
            <select
              name="sentiment"
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm"
            >
              <option value="">Sentiment...</option>
              <option value="positive">😊 Positive</option>
              <option value="neutral">😐 Neutral</option>
              <option value="negative">😤 Negative</option>
            </select>
          </div>
          <textarea
            name="content"
            placeholder="What did the client say? Paste the feedback here..."
            required
            rows={4}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-amber-500"
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
              Save Feedback
            </button>
          </div>
        </form>
      )}

      {/* Feedback cards */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item._id}
            className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 group hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold">{item.client}</span>
                  <span className="text-xs text-zinc-500">
                    {sourceEmoji[item.source]} {item.source}
                  </span>
                  {item.sentiment && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${sentimentColors[item.sentiment]}`}
                    >
                      {sentimentEmoji[item.sentiment]} {item.sentiment}
                    </span>
                  )}
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full text-white ${statusColors[item.status]}`}
                  >
                    {item.status}
                  </span>
                  <span className="text-xs text-zinc-600 ml-auto">{item.date}</span>
                </div>
                <p className="text-sm text-zinc-300 whitespace-pre-wrap">
                  {item.content}
                </p>
                {item.actionItems && item.actionItems.length > 0 && (
                  <div className="mt-3 space-y-1">
                    <p className="text-xs text-zinc-500 font-medium">Action Items:</p>
                    {item.actionItems.map((action, i) => (
                      <p key={i} className="text-xs text-amber-400 pl-3">
                        → {action}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.status === "new" && (
                  <button
                    onClick={() =>
                      updateFeedback({ id: item._id, status: "reviewed" })
                    }
                    className="text-xs px-2 py-1 bg-amber-500/20 text-amber-300 rounded hover:bg-amber-500/30"
                  >
                    Mark Reviewed
                  </button>
                )}
                {item.status === "reviewed" && (
                  <button
                    onClick={() =>
                      updateFeedback({ id: item._id, status: "actioned" })
                    }
                    className="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded hover:bg-green-500/30"
                  >
                    Mark Actioned
                  </button>
                )}
                <button
                  onClick={() =>
                    updateFeedback({ id: item._id, status: "archived" })
                  }
                  className="text-xs px-2 py-1 bg-zinc-700 text-zinc-400 rounded hover:bg-zinc-600"
                >
                  Archive
                </button>
                <button
                  onClick={() => deleteFeedback({ id: item._id })}
                  className="text-xs px-2 py-1 text-red-400 hover:bg-red-500/20 rounded"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-12 text-center">
            <p className="text-zinc-500">No feedback yet</p>
            <p className="text-zinc-600 text-sm mt-1">
              Add client feedback manually, or tell Cortana to monitor your email for it.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
