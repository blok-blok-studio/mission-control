"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";

interface CouncilResponse {
  agent: string;
  model: string;
  response: string;
}

const councilMembers = [
  { name: "Cortana", role: "COO / Chief of Staff", emoji: "⚡", model: "Claude Opus 4", color: "amber", perspective: "Operations, delegation, risk management" },
  { name: "Nova", role: "CMO", emoji: "🚀", model: "Claude Sonnet 4.5", color: "purple", perspective: "Marketing, content, growth, revenue" },
  { name: "Muse", role: "Creative Director", emoji: "🎨", model: "Claude Sonnet 4.5", color: "pink", perspective: "Brand, design, visual strategy" },
  { name: "Atlas", role: "CTO", emoji: "⚙️", model: "Claude Sonnet 4.5", color: "blue", perspective: "Technology, architecture, feasibility" },
  { name: "Sage", role: "Account Manager", emoji: "🤝", model: "Claude Haiku 4.5", color: "green", perspective: "Client relations, satisfaction, delivery" },
];

const colorMap: Record<string, { border: string; bg: string }> = {
  amber: { border: "border-amber-500/20", bg: "bg-amber-500/20" },
  purple: { border: "border-purple-500/20", bg: "bg-purple-500/20" },
  pink: { border: "border-pink-500/20", bg: "bg-pink-500/20" },
  blue: { border: "border-blue-500/20", bg: "bg-blue-500/20" },
  green: { border: "border-green-500/20", bg: "bg-green-500/20" },
};

export default function CouncilPage() {
  const [question, setQuestion] = useState("");
  const [responses, setResponses] = useState<CouncilResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<
    { question: string; responses: CouncilResponse[] }[]
  >([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setResponses([]);

    setTimeout(() => {
      setResponses([
        {
          agent: "System",
          model: "",
          response:
            "Council session submitted. In the live version, each agent deliberates independently. Say 'council: [your question]' in the main chat to trigger a real council session via Cortana.",
        },
      ]);
      setLoading(false);
      setHistory((prev) => [
        { question, responses: [{ agent: "System", model: "", response: "Council invoked" }] },
        ...prev,
      ]);
      setQuestion("");
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Council</h1>
        <p className="text-zinc-400 mt-1">
          Multi-agent deliberation — 5 perspectives on every big decision
        </p>
      </div>

      {/* Council Members */}
      <div className="grid grid-cols-5 gap-3">
        {councilMembers.map((member) => {
          const colors = colorMap[member.color];
          return (
            <div
              key={member.name}
              className={`bg-zinc-900 rounded-xl border ${colors.border} p-4 text-center`}
            >
              <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-xl ${colors.bg}`}>
                {member.emoji}
              </div>
              <p className="text-sm font-semibold">{member.name}</p>
              <p className="text-[10px] text-zinc-500">{member.role}</p>
              <p className="text-[9px] text-zinc-600 mt-1">{member.model}</p>
              <p className="text-[9px] text-zinc-700 mt-1 italic">{member.perspective}</p>
            </div>
          );
        })}
      </div>

      {/* Question Input */}
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 rounded-xl border border-zinc-800 p-4"
      >
        <p className="text-sm text-zinc-400 mb-3">
          Ask a strategic question and all 5 council members will deliberate independently, each from their domain expertise.
        </p>
        <div className="flex gap-3">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., Should we take on this client? Should we pivot pricing? What's our content strategy for Q2?"
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="px-4 py-2.5 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Send size={16} />
            )}
            Convene
          </button>
        </div>
      </form>

      {/* Responses */}
      {responses.length > 0 && (
        <div className="space-y-4">
          {responses.map((r, i) => (
            <div
              key={i}
              className="bg-zinc-900 rounded-xl border border-zinc-800 p-5"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-sm">{r.agent}</span>
                {r.model && (
                  <span className="text-[10px] text-zinc-600">{r.model}</span>
                )}
              </div>
              <p className="text-sm text-zinc-300 whitespace-pre-wrap">
                {r.response}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Previous Sessions</h2>
          {history.map((session, i) => (
            <div
              key={i}
              className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-4"
            >
              <p className="text-sm font-medium mb-1">{session.question}</p>
              <p className="text-xs text-zinc-500">
                {session.responses[0]?.response}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* How to use */}
      <div className="bg-zinc-800/30 rounded-xl p-5 border border-zinc-800/50">
        <h3 className="text-sm font-semibold mb-2">💡 How to use the Council</h3>
        <p className="text-xs text-zinc-500">
          In chat (Telegram or webchat), say <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-amber-400">council: [your question]</code> and Cortana will spin up all 5 council members to deliberate independently. Each brings their domain expertise — marketing, creative, tech, client relations — so you get a well-rounded answer before making big decisions.
        </p>
      </div>
    </div>
  );
}
