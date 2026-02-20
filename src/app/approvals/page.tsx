"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useEffect } from "react";
import { Id } from "../../../convex/_generated/dataModel";
import { Check, X, Clock, AlertTriangle, FileText, Send, Rocket, CreditCard, Server } from "lucide-react";

const categoryConfig: Record<string, { icon: typeof FileText; color: string; label: string }> = {
  proposal: { icon: FileText, color: "text-blue-400", label: "Proposal" },
  post: { icon: Send, color: "text-purple-400", label: "Post" },
  email: { icon: Send, color: "text-cyan-400", label: "Email" },
  deploy: { icon: Server, color: "text-green-400", label: "Deploy" },
  spend: { icon: CreditCard, color: "text-amber-400", label: "Spend" },
  other: { icon: Rocket, color: "text-zinc-400", label: "Other" },
};

const priorityConfig: Record<string, { bg: string; text: string }> = {
  low: { bg: "bg-zinc-600", text: "text-white" },
  medium: { bg: "bg-blue-600", text: "text-white" },
  high: { bg: "bg-orange-500", text: "text-white" },
  urgent: { bg: "bg-red-500 animate-pulse", text: "text-white" },
};

const statusConfig: Record<string, { bg: string; text: string; icon: typeof Check }> = {
  pending: { bg: "bg-amber-500/15", text: "text-amber-400", icon: Clock },
  approved: { bg: "bg-green-500/15", text: "text-green-400", icon: Check },
  rejected: { bg: "bg-red-500/15", text: "text-red-400", icon: X },
  expired: { bg: "bg-zinc-500/15", text: "text-zinc-400", icon: AlertTriangle },
};

type TabFilter = "pending" | "all" | "approved" | "rejected";

export default function ApprovalsPage() {
  const allApprovals = useQuery(api.approvals.list, {});
  const pendingCount = useQuery(api.approvals.pendingCount, {});
  const resolveApproval = useMutation(api.approvals.resolve);
  const seedApprovals = useMutation(api.approvals.seed);
  const [tab, setTab] = useState<TabFilter>("pending");
  const [reviewingId, setReviewingId] = useState<Id<"approvals"> | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [expandedId, setExpandedId] = useState<Id<"approvals"> | null>(null);

  // Auto-seed if empty
  useEffect(() => {
    if (allApprovals && allApprovals.length === 0) {
      seedApprovals();
    }
  }, [allApprovals, seedApprovals]);

  const filtered = allApprovals?.filter((a) => {
    if (tab === "all") return true;
    return a.status === tab;
  }) ?? [];

  const handleResolve = async (id: Id<"approvals">, status: "approved" | "rejected") => {
    await resolveApproval({ id, status, reviewNote: reviewNote || undefined });
    setReviewingId(null);
    setReviewNote("");
  };

  const tabs: { key: TabFilter; label: string; count?: number }[] = [
    { key: "pending", label: "Pending", count: pendingCount ?? 0 },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
    { key: "all", label: "All" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Approvals</h1>
          <p className="text-zinc-400 mt-1">
            Review proposals and actions from your agents
          </p>
        </div>
        {(pendingCount ?? 0) > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/15 border border-amber-500/30 rounded-xl">
            <Clock size={16} className="text-amber-400" />
            <span className="text-sm font-medium text-amber-400">
              {pendingCount} awaiting review
            </span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-zinc-900 rounded-xl p-1 border border-zinc-800">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
              tab === t.key
                ? "bg-zinc-800 text-white font-medium"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-medium">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Approval Cards */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-12 text-center">
            <Check size={32} className="text-green-500 mx-auto mb-3" />
            <p className="text-zinc-400">
              {tab === "pending" ? "Nothing awaiting approval — you're all caught up!" : "No items in this category."}
            </p>
          </div>
        )}

        {filtered.map((approval) => {
          const cat = categoryConfig[approval.category] ?? categoryConfig.other;
          const pri = priorityConfig[approval.priority];
          const stat = statusConfig[approval.status];
          const StatusIcon = stat.icon;
          const CatIcon = cat.icon;
          const isExpanded = expandedId === approval._id;
          const isReviewing = reviewingId === approval._id;

          return (
            <div
              key={approval._id}
              className={`bg-zinc-900 rounded-xl border ${
                approval.status === "pending" ? "border-amber-500/20" : "border-zinc-800"
              } overflow-hidden transition-all`}
            >
              {/* Header */}
              <div
                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-zinc-800/30 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : approval._id)}
              >
                {/* Category Icon */}
                <div className={`w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0`}>
                  <CatIcon size={18} className={cat.color} />
                </div>

                {/* Title + Meta */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold truncate">{approval.title}</h3>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded ${pri.bg} ${pri.text}`}>
                      {approval.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[10px] text-zinc-500">
                      {approval.submittedByEmoji} {approval.submittedBy}
                    </span>
                    <span className="text-[10px] text-zinc-600">
                      {new Date(approval.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span className={`text-[10px] ${cat.color}`}>{cat.label}</span>
                  </div>
                </div>

                {/* Status Badge */}
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${stat.bg} flex-shrink-0`}>
                  <StatusIcon size={12} className={stat.text} />
                  <span className={`text-xs font-medium capitalize ${stat.text}`}>
                    {approval.status}
                  </span>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-zinc-800">
                  {/* Description */}
                  <div className="p-4 bg-zinc-950/50">
                    <p className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
                      {approval.description}
                    </p>
                  </div>

                  {/* Review Note (if resolved) */}
                  {approval.reviewNote && (
                    <div className="px-4 py-3 bg-zinc-800/30 border-t border-zinc-800">
                      <p className="text-[10px] text-zinc-500 mb-1">Review Note</p>
                      <p className="text-sm text-zinc-400">{approval.reviewNote}</p>
                      {approval.reviewedAt && (
                        <p className="text-[10px] text-zinc-600 mt-1">
                          Reviewed {new Date(approval.reviewedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Action Buttons (pending only) */}
                  {approval.status === "pending" && (
                    <div className="p-4 border-t border-zinc-800 bg-zinc-900">
                      {isReviewing ? (
                        <div className="space-y-3">
                          <textarea
                            value={reviewNote}
                            onChange={(e) => setReviewNote(e.target.value)}
                            placeholder="Add a note (optional)..."
                            rows={2}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleResolve(approval._id, "approved")}
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                              <Check size={14} /> Approve
                            </button>
                            <button
                              onClick={() => handleResolve(approval._id, "rejected")}
                              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors"
                            >
                              <X size={14} /> Reject
                            </button>
                            <button
                              onClick={() => { setReviewingId(null); setReviewNote(""); }}
                              className="px-4 py-2 text-sm text-zinc-500 hover:text-zinc-300"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setReviewingId(approval._id)}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-sm font-medium transition-colors"
                          >
                            Review & Decide
                          </button>
                          <button
                            onClick={() => handleResolve(approval._id, "approved")}
                            className="flex items-center gap-2 px-3 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg text-sm transition-colors"
                          >
                            <Check size={14} /> Quick Approve
                          </button>
                          <button
                            onClick={() => handleResolve(approval._id, "rejected")}
                            className="flex items-center gap-2 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg text-sm transition-colors"
                          >
                            <X size={14} /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info */}
      <div className="bg-zinc-800/30 rounded-xl p-5 border border-zinc-800/50">
        <h3 className="text-sm font-semibold mb-2">🔒 How Approvals Work</h3>
        <p className="text-xs text-zinc-500">
          Agents submit proposals, posts, emails, and deployments here before executing. Nothing external happens without your sign-off. Overnight research, content drafts, and spend requests all land here for review. Approve, reject, or add notes — agents will see your decision and act accordingly.
        </p>
      </div>
    </div>
  );
}
