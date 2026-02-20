"use client";

import { ShieldCheck } from "lucide-react";

export default function ApprovalsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Approvals</h1>
        <p className="text-zinc-400 mt-1">
          Review and approve actions before they go live
        </p>
      </div>
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-12 text-center">
        <ShieldCheck size={48} className="text-zinc-700 mx-auto mb-4" />
        <p className="text-zinc-500">No pending approvals</p>
        <p className="text-zinc-600 text-sm mt-1">
          When Cortana needs your sign-off on external actions (emails, posts, deploys), they&apos;ll appear here.
        </p>
      </div>
    </div>
  );
}
