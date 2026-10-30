"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ListTodo,
} from "lucide-react";

export type RightSidebarTask = {
  id: string;
  title: string;
  dueDate: string;
  meta: string;
};

type DashboardRightSidebarProps = {
  tasks?: RightSidebarTask[];
  onViewAll?: () => void;
};

const weekdays = ["M", "T", "W", "T", "F", "S", "S"];

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeDate(date: string) {
  return date.slice(0, 10);
}

function formatDueDate(date: string) {
  // Parse a date-only value at local noon to avoid timezone day shifts.
  const [year, month, day] = normalizeDate(date).split("-").map(Number);
  if (!year || !month || !day) return "No date";

  const parsed = new Date(year, month - 1, day, 12);
  if (Number.isNaN(parsed.getTime())) return "No date";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
  }).format(parsed);
}

export default function DashboardRightSidebar({
  tasks = [],
  onViewAll,
}: DashboardRightSidebarProps) {
  const [today, setToday] = useState<Date | null>(null);
  const [visibleMonth, setVisibleMonth] = useState<Date | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const currentDate = new Date();
    setToday(currentDate);
    setVisibleMonth(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    );
  }, []);

  const todayKey = today ? getDateKey(today) : "";
  const year = visibleMonth?.getFullYear() ?? 0;
  const month = visibleMonth?.getMonth() ?? 0;
  const monthLabel = visibleMonth
    ? new Intl.DateTimeFormat("en-IN", {
        month: "long",
        year: "numeric",
      }).format(visibleMonth)
    : "";

  const calendarDays = useMemo(() => {
    if (!visibleMonth) return [];

    const currentYear = visibleMonth.getFullYear();
    const currentMonth = visibleMonth.getMonth();
    const offset = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7;
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();
    const cells = Math.ceil((offset + totalDays) / 7) * 7;

    return Array.from({ length: cells }, (_, index) => {
      const day = index - offset + 1;
      return day > 0 && day <= totalDays ? day : null;
    });
  }, [visibleMonth]);

  const sortedTasks = useMemo(
    () =>
      [...tasks].sort((a, b) =>
        normalizeDate(a.dueDate).localeCompare(normalizeDate(b.dueDate))
      ),
    [tasks]
  );

  const taskDateSet = useMemo(
    () => new Set(tasks.map((task) => normalizeDate(task.dueDate))),
    [tasks]
  );

  const visibleTasks = selectedDate
    ? sortedTasks.filter(
        (task) => normalizeDate(task.dueDate) === selectedDate
      )
    : sortedTasks.slice(0, 3);

  function changeMonth(amount: number) {
    setVisibleMonth((current) =>
      current
        ? new Date(current.getFullYear(), current.getMonth() + amount, 1)
        : current
    );
    setSelectedDate(null);
  }

  if (!today || !visibleMonth) {
    return (
      <aside className="dashboard-right-sidebar min-w-0 space-y-5 rounded-[22px] border border-[#E6E8DE] bg-[#FBFCF9] p-3.5 sm:p-4">
        <p className="text-[10px] text-[#858D80]">Loading calendar...</p>
      </aside>
    );
  }

  return (
    <aside className="dashboard-right-sidebar min-w-0 space-y-5 rounded-[22px] border border-[#E6E8DE] bg-[#FBFCF9] p-3.5 sm:p-4">
      {/* Calendar */}
      <section aria-label="Task calendar">
        <div className="mb-3.5 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-[#899183]">
              YOUR PLANNER
            </p>
            <h2 className="mt-1 truncate font-heading text-[15px] font-bold tracking-[-0.035em] text-[#202821]">
              {monthLabel}
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-0.5">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() => changeMonth(-1)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[#647366] transition hover:bg-[#E9EEE5] hover:text-[#244A3D]"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              type="button"
              aria-label="Next month"
              onClick={() => changeMonth(1)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-[#647366] transition hover:bg-[#E9EEE5] hover:text-[#244A3D]"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-y-1">
          {weekdays.map((day, index) => (
            <span
              key={`${day}-${index}`}
              className="flex h-7 items-center justify-center text-[9px] font-semibold text-[#91988B]"
            >
              {day}
            </span>
          ))}

          {calendarDays.map((day, index) => {
            if (day === null) {
              return <span key={`blank-${index}`} className="h-8" />;
            }

            const dateKey = getDateKey(new Date(year, month, day));
            const isToday = dateKey === todayKey;
            const isSelected = selectedDate
              ? selectedDate === dateKey
              : isToday;
            const hasTasks = taskDateSet.has(dateKey);

            return (
              <button
                key={dateKey}
                type="button"
                aria-label={`${day} ${monthLabel}`}
                aria-pressed={isSelected}
                onClick={() => setSelectedDate(dateKey)}
                className={`relative mx-auto flex h-8 w-8 items-center justify-center rounded-full text-[10px] transition-colors duration-200 ${
                  isSelected
                    ? "bg-[#A45D42] font-semibold text-white shadow-[0_4px_10px_rgba(164,93,66,0.18)]"
                    : "text-[#596357] hover:bg-[#E9EEE5]"
                }`}
              >
                {day}
                {hasTasks && (
                  <span
                    className={`absolute bottom-[3px] h-1 w-1 rounded-full ${
                      isSelected ? "bg-white" : "bg-[#A45D42]"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => {
            setVisibleMonth(
              new Date(today.getFullYear(), today.getMonth(), 1)
            );
            setSelectedDate(todayKey);
          }}
          className="mt-3 text-[10px] font-medium text-[#55745A] transition hover:text-[#244A3D]"
        >
          Return to today
        </button>
      </section>

      <div className="h-px bg-[#E4E7DC]" />

      {/* Upcoming tasks */}
      <section aria-label="Upcoming tasks">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[8px] font-semibold uppercase tracking-[0.15em] text-[#899183]">
              STAY ON TRACK
            </p>
            <h2 className="mt-1 font-heading text-[15px] font-bold tracking-[-0.035em] text-[#202821]">
              {selectedDate ? "Selected day" : "Upcoming tasks"}
            </h2>
          </div>
          {onViewAll && (
            <button
              type="button"
              onClick={onViewAll}
              className="shrink-0 text-[10px] font-semibold text-[#A45D42] transition hover:text-[#75402E]"
            >
              View all
            </button>
          )}
        </div>

        {visibleTasks.length > 0 ? (
          <div className="space-y-2.5">
            {visibleTasks.map((task, index) => {
              const tones = [
                { bg: "#F4E4DC", fg: "#A45D42" },
                { bg: "#DFEAE0", fg: "#41694C" },
                { bg: "#EAE5F2", fg: "#76618F" },
              ];
              const tone = tones[index % tones.length];

              return (
                <article
                  key={task.id}
                  className="dashboard-schedule-card flex min-w-0 items-center gap-2.5 rounded-[15px] border border-[#ECEDE5] bg-white p-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#DCE4D7] hover:shadow-[0_7px_16px_-13px_rgba(36,74,61,0.35)]"
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]"
                    style={{ backgroundColor: tone.bg, color: tone.fg }}
                  >
                    {index % 2 === 0 ? (
                      <ListTodo size={14} strokeWidth={1.8} />
                    ) : (
                      <CalendarDays size={14} strokeWidth={1.8} />
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[10px] font-semibold leading-4 text-[#303A31]">
                      {task.title}
                    </h3>
                    <p className="mt-0.5 flex min-w-0 items-center gap-1 text-[9px] leading-4 text-[#838B7D]">
                      <Clock3 size={9} className="shrink-0" />
                      <span className="truncate">{task.meta}</span>
                    </p>
                  </div>

                  <span className="shrink-0 text-[9px] font-medium text-[#92988B]">
                    {formatDueDate(task.dueDate)}
                  </span>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[15px] border border-dashed border-[#DDE3D7] bg-white/70 px-3 py-6 text-center">
            <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-[#E9EEE5] text-[#55745A]">
              <CalendarDays size={16} />
            </span>
            <p className="mt-2.5 text-[10px] font-semibold text-[#455548]">
              No tasks scheduled
            </p>
            <p className="mt-1 text-[9px] leading-4 text-[#92988B]">
              {selectedDate
                ? "There are no tasks for this date."
                : "Upcoming deadlines will appear here."}
            </p>
          </div>
        )}
      </section>
    </aside>
  );
}
