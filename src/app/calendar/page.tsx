"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";

const typeColors: Record<string, string> = {
  cron: "bg-blue-500",
  reminder: "bg-amber-500",
  meeting: "bg-purple-500",
  deadline: "bg-red-500",
  task: "bg-green-500",
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function CalendarPage() {
  const events = useQuery(api.events.list, {});
  const createEvent = useMutation(api.events.create);
  const deleteEvent = useMutation(api.events.remove);
  const [showForm, setShowForm] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const prevMonth = () =>
    setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () =>
    setCurrentDate(new Date(year, month + 1, 1));

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return (events ?? []).filter((e) => e.startTime.startsWith(dateStr));
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    await createEvent({
      title: form.get("title") as string,
      description: (form.get("description") as string) || undefined,
      type: form.get("type") as "cron" | "reminder" | "meeting" | "deadline" | "task",
      startTime: form.get("startTime") as string,
      endTime: (form.get("endTime") as string) || undefined,
      color: (form.get("color") as string) || undefined,
    });
    setShowForm(false);
  };

  const today = new Date();
  const isToday = (day: number) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-zinc-400 mt-1">Scheduled tasks, cron jobs & events</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-400 transition-colors"
        >
          + New Event
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 grid grid-cols-2 gap-4"
        >
          <input
            name="title"
            placeholder="Event title"
            required
            className="col-span-2 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-amber-500"
          />
          <input
            name="description"
            placeholder="Description (optional)"
            className="col-span-2 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-amber-500"
          />
          <select
            name="type"
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm"
          >
            <option value="task">Task</option>
            <option value="meeting">Meeting</option>
            <option value="deadline">Deadline</option>
            <option value="reminder">Reminder</option>
            <option value="cron">Cron Job</option>
          </select>
          <input
            name="startTime"
            type="datetime-local"
            required
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-amber-500"
          />
          <input
            name="endTime"
            type="datetime-local"
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

      {/* Calendar Grid */}
      <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <button
            onClick={prevMonth}
            className="px-3 py-1 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg"
          >
            ← Prev
          </button>
          <h2 className="text-lg font-semibold">{monthName}</h2>
          <button
            onClick={nextMonth}
            className="px-3 py-1 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg"
          >
            Next →
          </button>
        </div>
        <div className="grid grid-cols-7">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="p-2 text-center text-xs font-medium text-zinc-500 border-b border-zinc-800"
            >
              {day}
            </div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[100px] border-b border-r border-zinc-800/50" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayEvents = getEventsForDay(day);
            return (
              <div
                key={day}
                className={`min-h-[100px] border-b border-r border-zinc-800/50 p-1.5 ${
                  isToday(day) ? "bg-amber-500/5" : ""
                }`}
              >
                <span
                  className={`text-xs inline-block w-6 h-6 text-center leading-6 rounded-full ${
                    isToday(day)
                      ? "bg-amber-500 text-black font-bold"
                      : "text-zinc-400"
                  }`}
                >
                  {day}
                </span>
                <div className="space-y-0.5 mt-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event._id}
                      className={`text-[10px] px-1.5 py-0.5 rounded truncate text-white ${
                        typeColors[event.type] ?? "bg-zinc-600"
                      } group relative cursor-pointer`}
                      onClick={() => deleteEvent({ id: event._id })}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <p className="text-[10px] text-zinc-500 px-1">
                      +{dayEvents.length - 3} more
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
