
"use client";

import { useEffect, useState } from "react";

import {
  MoreHorizontal,
  Plus,
  Search,
  Check,
  Circle,
  ListTodo,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import type { DashboardView } from "@/components/dashboard/layout/1. dashboard-sidebar";
import type {
  DashboardTask,
  RelativeDates,
} from "@/components/dashboard/types";

import { getDateLabel } from "@/components/dashboard/lib/date-utils";

type RecentTasksProps = {
  tasks: DashboardTask[];
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  searchQuery: string;
  relativeDates: RelativeDates;
  loading: boolean;
  error: string | null;
  onCreateTask: () => void;
  onTaskDetails: (task: DashboardTask) => void;
};

const taskViews: DashboardView[] = [
  "All tasks",
  "Assigned to me",
  "Created by me",
  "Completed",
];

const TASKS_PER_PAGE = 6;

export default function RecentTasks({
  tasks,
  activeView,
  onViewChange,
  searchQuery,
  relativeDates,
  loading,
  error,
  onCreateTask,
  onTaskDetails,
}: RecentTasksProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination.
  const totalTasks = tasks.length;

  const totalPages = Math.max(
    1,
    Math.ceil(totalTasks / TASKS_PER_PAGE)
  );

  // Prevent an invalid page if the number of tasks decreases.
  const safePage = Math.min(currentPage, totalPages);

  const startIndex = (safePage - 1) * TASKS_PER_PAGE;
  const endIndex = Math.min(
    startIndex + TASKS_PER_PAGE,
    totalTasks
  );

  const visibleTasks = tasks.slice(startIndex, endIndex);

  // Reset pagination when the task view, search, or task list changes.
  useEffect(() => {
    setCurrentPage(1);
  }, [activeView, searchQuery, tasks]);

  function handlePreviousPage() {
    setCurrentPage((page) => Math.max(1, page - 1));
  }

  function handleNextPage() {
    setCurrentPage((page) =>
      Math.min(totalPages, page + 1)
    );
  }

  const hasPagination = totalTasks > TASKS_PER_PAGE;

  return (
    <section
      id="dashboard-tasks"
      className="scroll-mt-24 overflow-hidden rounded-2xl border border-[#E5E0D5] bg-white"
      aria-labelledby="recent-tasks-heading"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EEEAE1] px-4 py-4 sm:px-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h2
              id="recent-tasks-heading"
              className="font-heading text-base font-bold text-[#202821]"
            >
              {activeView === "Overview" ? "Recent tasks" : activeView}
            </h2>

            {!loading && !error && (
              <span className="rounded-full bg-[#E8EDE4] px-2.5 py-1 text-[10px] font-semibold tabular-nums text-[#31553D]">
                {totalTasks}
              </span>
            )}
          </div>

          <p className="mt-1 text-[10px] text-[#7A8176]">
            Keep an eye on what needs to happen next.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateTask}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#244A3D] px-3 py-2.5 text-[10px] font-semibold text-white transition hover:bg-[#19382E]"
        >
          <Plus size={14} />
          New task
        </button>
      </div>

      {/* Task Views */}
      <div className="flex gap-1.5 overflow-x-auto border-b border-[#EEEAE1] px-3 py-3 sm:px-4">
        {taskViews.map((view) => (
          <button
            key={view}
            type="button"
            onClick={() => onViewChange(view)}
            aria-pressed={activeView === view}
            className={`shrink-0 rounded-lg px-3 py-2 text-[10px] font-medium transition ${
              activeView === view
                ? "bg-[#244A3D] text-white"
                : "text-[#687166] hover:bg-[#F3F2EA]"
            }`}
          >
            {view}
          </button>
        ))}
      </div>

      {/* Table Heading */}
      <div className="hidden grid-cols-[minmax(0,1.5fr)_105px_82px_82px_105px] items-center gap-2 bg-[#FBFAF6] px-5 py-3 text-[9px] font-semibold uppercase tracking-[.08em] text-[#858B7F] lg:grid">
        <span>Task</span>
        <span>Assignee</span>
        <span>Deadline</span>
        <span>Priority</span>
        <span>Status</span>
      </div>

      {/* Task List */}
      <div className="divide-y divide-[#EEEAE1]">
        {loading && (
          <div
            className="px-5 py-12 text-center"
            role="status"
            aria-live="polite"
          >
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-[#DDE5D8] border-t-[#244A3D]" />
            <p className="mt-3 text-xs text-[#7A8176]">
              Loading your tasks...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="px-5 py-10 text-center" role="alert">
            <p className="text-sm font-semibold text-[#A45D42]">
              Unable to load your tasks
            </p>
            <p className="mt-2 text-xs text-[#7A8176]">
              {error}
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          visibleTasks.map((task) => (
            <div
              key={task.id}
              className="dashboard-task-row grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3.5 py-4 sm:px-5 lg:grid-cols-[minmax(0,1.5fr)_105px_82px_82px_105px] lg:gap-2"
            >
              {/* Task Information */}
              <div className="flex min-w-0 items-start gap-3">
                <span
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    task.status === "Completed"
                      ? "bg-[#E2EADD] text-[#31553D]"
                      : task.priority === "High"
                        ? "bg-[#F2E5DB] text-[#94563E]"
                        : "bg-[#E1E8EB] text-[#4B6878]"
                  }`}
                >
                  {task.status === "Completed" ? (
                    <Check size={16} />
                  ) : (
                    <ListTodo size={16} />
                  )}
                </span>

                <div className="min-w-0">
                  <p
                    className={`break-words text-xs font-semibold leading-5 sm:text-[13px] ${
                      task.status === "Completed"
                        ? "text-[#82897E] line-through"
                        : "text-[#293329]"
                    }`}
                  >
                    {task.title}
                  </p>

                  <p className="mt-1 text-[10px] text-[#828879]">
                    {task.createdBy === "You"
                      ? "Created by you"
                      : `Created by ${task.createdBy}`}
                  </p>

                  {/* Mobile Details */}
                  <div className="mt-2 flex flex-wrap gap-1.5 lg:hidden">
                    <span
                      className={`rounded-md px-2 py-1 text-[9px] font-medium ${
                        task.status === "Completed"
                          ? "bg-[#E2EADD] text-[#31553D]"
                          : task.status === "In Progress"
                            ? "bg-[#DFE8EB] text-[#4B6878]"
                            : "bg-[#F0E6D6] text-[#75563B]"
                      }`}
                    >
                      {task.status}
                    </span>

                    <span
                      className={`rounded-md px-2 py-1 text-[9px] font-medium ${
                        task.priority === "High"
                          ? "bg-[#F2E5DB] text-[#94563E]"
                          : task.priority === "Medium"
                            ? "bg-[#F0E6D6] text-[#75563B]"
                            : "bg-[#F0F0E8] text-[#687166]"
                      }`}
                    >
                      {task.priority} priority
                    </span>

                    <span className="rounded-md bg-[#F5F3EC] px-2 py-1 text-[9px] text-[#687166]">
                      {getDateLabel(task.dueDate, relativeDates)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Assignee */}
              <div className="hidden min-w-0 items-center gap-2 lg:flex">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E8D9C5] text-[9px] font-bold text-[#624B35]">
                  {task.initials}
                </span>
                <span className="truncate text-[10px] text-[#687166]">
                  {task.assignee}
                </span>
              </div>

              {/* Deadline */}
              <span className="hidden text-[10px] text-[#687166] lg:block">
                {getDateLabel(task.dueDate, relativeDates)}
              </span>

              {/* Priority */}
              <span className="hidden text-[10px] font-semibold lg:block">
                <Circle
                  size={7}
                  className={`mr-1 inline fill-current ${
                    task.priority === "High"
                      ? "text-[#A45D42]"
                      : task.priority === "Medium"
                        ? "text-[#B69451]"
                        : "text-[#789477]"
                  }`}
                />
                {task.priority}
              </span>

              {/* Status and Actions */}
              <div className="flex items-center justify-end gap-1.5 lg:justify-start">
                <span
                  className={`rounded-md px-2 py-1.5 text-[9px] font-semibold ${
                    task.status === "Completed"
                      ? "bg-[#E2EADD] text-[#31553D]"
                      : task.status === "In Progress"
                        ? "bg-[#DFE8EB] text-[#4B6878]"
                        : "bg-[#F0E6D6] text-[#75563B]"
                  }`}
                >
                  {task.status}
                </span>

                <button
                  type="button"
                  onClick={() => onTaskDetails(task)}
                  aria-label={`Details for ${task.title}`}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#828879] transition hover:bg-[#F3F2EA] hover:text-[#244A3D]"
                >
                  <MoreHorizontal size={17} />
                </button>
              </div>
            </div>
          ))}

        {/* Empty State */}
        {!loading && !error && totalTasks === 0 && (
          <div className="px-5 py-12 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8EDE4] text-[#31553D]">
              <Search size={20} />
            </span>

            <h3 className="mt-4 font-heading text-sm font-bold text-[#293329]">
              {searchQuery ? "No matching tasks" : "No tasks yet"}
            </h3>

            <p className="mt-1 text-xs leading-5 text-[#7A8176]">
              {searchQuery
                ? "Try another search or select a different task view."
                : "Tasks created by you or assigned to you will appear here."}
            </p>

            {searchQuery && (
              <p className="mt-3 text-[10px] text-[#858D80]">
                Clear the search field to see all your tasks.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EEEAE1] bg-[#FBFAF6] px-4 py-3 sm:px-5">
        <span className="text-[10px] text-[#7A8176] tabular-nums">
          {loading
            ? "Loading tasks..."
            : error
              ? "Tasks unavailable"
              : totalTasks === 0
                ? "No tasks to display"
                : `Showing ${startIndex + 1}–${endIndex} of ${totalTasks} tasks`}
        </span>

        <div className="flex items-center gap-3">
          {/* Pagination Controls */}
          {!loading && !error && hasPagination && (
            <nav
              aria-label="Task list pagination"
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={handlePreviousPage}
                disabled={safePage === 1}
                aria-label="Previous page"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E0D5] bg-white text-[#53665C] transition hover:border-[#244A3D] hover:text-[#244A3D] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>

              <span
                className="min-w-[75px] text-center text-[10px] font-semibold tabular-nums text-[#53665C]"
                aria-live="polite"
              >
                Page {safePage} of {totalPages}
              </span>

              <button
                type="button"
                onClick={handleNextPage}
                disabled={safePage === totalPages}
                aria-label="Next page"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E5E0D5] bg-white text-[#53665C] transition hover:border-[#244A3D] hover:text-[#244A3D] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </nav>
          )}

          <button
            type="button"
            onClick={onCreateTask}
            className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#244A3D] transition hover:text-[#8A4528]"
          >
            <Plus size={13} />
            Add task
          </button>
        </div>
      </div>
    </section>
  );
}
