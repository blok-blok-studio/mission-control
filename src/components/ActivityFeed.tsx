"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Clock, GitCommit, CheckCircle2, FileText, User, Bell, Star } from "lucide-react";
import Link from "next/link";

const typeIcons: Record<string, any> = {
  task_created: FileText,
  task_updated: GitCommit,
  task_completed: CheckCircle2,
  content_created: Star,
  content_stage_changed: GitCommit,
  content_published: CheckCircle2,
  agent_status_changed: User,
  approval_submitted: Bell,
  approval_resolved: CheckCircle2,
  cron_completed: Clock,
  feedback_received: FileText,
  memory_created: FileText,
};

const typeColors: Record<string, string> = {
  task_created: "text-blue-400",
  task_updated: "text-amber-400",
  task_completed: "text-green-400",
  content_created: "text-purple-400",
  content_stage_changed: "text-cyan-400",
  content_published: "text-green-400",
  agent_status_changed: "text-orange-400",
  approval_submitted: "text-yellow-400",
  approval_resolved: "text-green-400",
  cron_completed: "text-zinc-400",
  feedback_received: "text-pink-400",
  memory_created: "text-indigo-400",
};

function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
}

export function ActivityFeed({ limit = 20 }: { limit?: number }) {
  const activities = useQuery(api.activities.recent, { limit });

  if (!activities) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin w-6 h-6 border-2 border-zinc-700 border-t-white rounded-full" />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-500">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>No activity yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => {
        const Icon = typeIcons[activity.type] || FileText;
        const color = typeColors[activity.type] || "text-zinc-400";
        
        return (
          <div
            key={activity._id}
            className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/30 hover:bg-zinc-800/50 transition-colors border border-zinc-800/50"
          >
            <div className={`p-2 rounded-lg bg-zinc-900 ${color}`}>
              <Icon className="w-4 h-4" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-white truncate">
                    {activity.title}
                  </p>
                  {activity.description && (
                    <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">
                      {activity.description}
                    </p>
                  )}
                </div>
                <time className="text-xs text-zinc-500 whitespace-nowrap">
                  {getRelativeTime(activity.createdAt)}
                </time>
              </div>
              
              {activity.actor && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  {activity.actorEmoji && (
                    <span className="text-xs">{activity.actorEmoji}</span>
                  )}
                  <span className="text-xs text-zinc-500">{activity.actor}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
