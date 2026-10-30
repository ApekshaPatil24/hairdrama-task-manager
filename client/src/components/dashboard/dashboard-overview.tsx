"use client";

import { useMemo, useState, type FormEvent } from "react";
import { Search, X } from "lucide-react";

import DashboardSidebar, {
  type DashboardView,
} from "@/components/dashboard/layout/1. dashboard-sidebar";

import DashboardTopbar from "@/components/dashboard/layout/2. dashboard-topbar";

import DashboardRightSidebar, {
  type RightSidebarTask,
} from "@/components/dashboard/layout/3. dashboard-right-sidebar";

import {
  createTask,
  updateTaskStatus,
  type CreateTaskInput,
  type TaskStatus,
} from "@/lib/api/tasks";

import CreateTaskDialog from "@/components/dashboard/dialogs/create-task-dialog";
import DashboardInsights from "@/components/dashboard/sections/dashboard-insights";
import DashboardStats from "@/components/dashboard/sections/dashboard-stats";
import DashboardWelcome from "@/components/dashboard/sections/dashboard-welcome";
import RecentTasks from "@/components/dashboard/sections/recent-tasks";
import { useDashboardTasks } from "@/components/dashboard/hooks/use-dashboard-tasks";
import { useRelativeDates } from "@/components/dashboard/hooks/use-relative-dates";
import { getInitials } from "@/components/dashboard/lib/date-utils";
import type { DashboardOverviewProps, DashboardTask } from "@/components/dashboard/types";
import TaskDetailsDialog from "@/components/dashboard/dialogs/task-details-dialog";

import { useToast } from "@/components/ui/toast-provider";

export default function DashboardOverview({
  userName,
  userEmail,
}: DashboardOverviewProps) {
  const [activeView, setActiveView] = useState<DashboardView>("Overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [selectedTask, setSelectedTask] =
  useState<DashboardTask | null>(null);

  const { showToast } = useToast();

  const {
  tasks,
  loading: tasksLoading,
  error: tasksError,
  refresh,
} = useDashboardTasks();

  const relativeDates = useRelativeDates();

  const firstName = userName.trim().split(/\s+/)[0] || "there";
  const userInitials = getInitials(userName);

  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        !query ||
        task.title.toLowerCase().includes(query) ||
        task.assignee.toLowerCase().includes(query) ||
        task.createdBy.toLowerCase().includes(query) ||
        task.status.toLowerCase().includes(query) ||
        task.priority.toLowerCase().includes(query);

      let matchesView = true;
      if (activeView === "Assigned to me") {
        matchesView = task.assignee === "You";
      } else if (activeView === "Created by me") {
        matchesView = task.createdBy === "You";
      } else if (activeView === "Completed") {
        matchesView = task.status === "Completed";
      }

      return matchesSearch && matchesView;
    });
  }, [tasks, searchQuery, activeView]);

  const rightSidebarTasks = useMemo<RightSidebarTask[]>(
    () =>
      tasks
        .filter(
          (task): task is DashboardTask & { dueDate: string } =>
            task.dueDate !== null && task.status !== "Completed",
        )
        .map((task) => ({
          id: task.id,
          title: task.title,
          dueDate: task.dueDate,
          meta: `${task.priority} priority · ${task.assignee}`,
        })),
    [tasks],
  );

  function selectView(view: DashboardView) {
    setActiveView(view);
    setNotice("");
  }

  function showTaskList() {
    setActiveView("All tasks");
    document.getElementById("dashboard-tasks")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  async function handleCreateTaskSubmit(
  values: CreateTaskInput
): Promise<void> {
  const createdTask = await createTask(values);

  await refresh();

  setActiveView("All tasks");
  setSearchQuery("");

  showToast(
    `"${createdTask.title}" was created successfully.`,
    "success"
  );
}

 function handleTaskDetails(task: DashboardTask) {
  setSelectedTask(task);
}

async function handleTaskStatusChange(
  status: TaskStatus
): Promise<void> {
  if (!selectedTask) {
    throw new Error("No task is currently selected.");
  }

  const updatedTask = await updateTaskStatus(
    selectedTask.id,
    status
  );

  await refresh();

  showToast(
    `"${updatedTask.title}" status updated successfully.`,
    "success"
  );
}

  return (
    <main className="dashboard-page min-h-svh w-full p-0 text-[#202821]">
      <div className="mx-auto grid min-h-svh w-full max-w-[1800px] overflow-hidden bg-[#F8F7F2] lg:grid-cols-[240px_minmax(0,1fr)]">
        {/* Desktop sidebar */}
        <div className="dashboard-sidebar-scale hidden min-h-0 lg:block">
          <DashboardSidebar
            activeView={activeView}
            onViewChange={selectView}
            userName={userName}
            userEmail={userEmail}
          />
        </div>

        {/* Mobile sidebar */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-[70] lg:hidden">
            <button
              type="button"
              aria-label="Close navigation overlay"
              onClick={() => setMobileNavOpen(false)}
              className="absolute inset-0 bg-[#101A13]/60 backdrop-blur-sm"
            />
            <div className="dashboard-sidebar-scale relative z-10 h-full w-fit">
              <DashboardSidebar
                activeView={activeView}
                onViewChange={selectView}
                userName={userName}
                userEmail={userEmail}
                mobile
                onClose={() => setMobileNavOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Workspace stage: topbar spans main content and planner */}
        <div className="grid min-w-0 grid-cols-1 items-start xl:grid-cols-[minmax(0,1fr)_330px]">
          <div className="h-[83px] min-h-[83px] min-w-0 xl:col-span-2">
            <DashboardTopbar
              userName={userName}
              userEmail={userEmail}
              activeView={activeView}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onMenuClick={() => setMobileNavOpen(true)}
              onNotificationClick={() =>
                setNotice("Task notifications will appear here once notification integration is connected.")
              }
            />
          </div>

          {/* Main dashboard sections */}
          <section className="min-w-0">
            <div className="min-w-0 space-y-6 p-4 sm:p-6 lg:p-7 2xl:p-8">
              {/* Mobile search */}
              <label className="flex items-center gap-2 rounded-xl border border-[#E5E0D5] bg-white px-3.5 py-3 md:hidden">
                <Search size={16} className="text-[#7A8176]" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search your tasks..."
                  aria-label="Search tasks"
                  className="w-full bg-transparent text-xs outline-none placeholder:text-[#999E93]"
                />
              </label>

              {notice && (
                <div role="status" className="flex items-start justify-between gap-3 rounded-xl border border-[#D9DDCE] bg-[#F0F2E9] px-4 py-3 text-xs leading-5 text-[#46574A]">
                  <span>{notice}</span>
                  <button type="button" onClick={() => setNotice("")} aria-label="Dismiss notice" className="shrink-0 rounded p-1 hover:bg-white">
                    <X size={14} />
                  </button>
                </div>
              )}

              <DashboardWelcome
                firstName={firstName}
                onCreateTask={() => setCreateOpen(true)}
                onExploreTasks={showTaskList}
              />

              <DashboardStats tasks={tasks} loading={tasksLoading} />

              <RecentTasks
                tasks={filteredTasks}
                activeView={activeView}
                onViewChange={selectView}
                searchQuery={searchQuery}
                relativeDates={relativeDates}
                loading={tasksLoading}
                error={tasksError}
                onCreateTask={() => setCreateOpen(true)}
                onTaskDetails={handleTaskDetails}
              />

              <DashboardInsights tasks={tasks} />

              {/* Planner appears below the main content on smaller screens. */}
              <div className="xl:hidden">
                <DashboardRightSidebar
                  tasks={rightSidebarTasks}
                  onViewAll={() => selectView("All tasks")}
                />
              </div>

              <footer className="flex flex-col gap-2 border-t border-[#E5E0D5] pt-4 text-[10px] text-[#7A8176] sm:flex-row sm:items-center sm:justify-between">
                <span>Hairdrama Tasks · Your workspace</span>
                <span>Plan · Organize · Grow together</span>
              </footer>
            </div>
          </section>

          {/* Fixed right planner on wide screens */}
          <aside className="dashboard-fixed-right-panel hidden min-w-0 border-l border-[#E5E0D5] bg-[#FBFAF6] xl:fixed xl:right-0 xl:top-[83px] xl:z-30 xl:block xl:h-[calc(100dvh-83px)] xl:w-[330px] xl:overflow-y-auto">
            <div className="p-4 2xl:p-5">
              <DashboardRightSidebar
                tasks={rightSidebarTasks}
                onViewAll={() => selectView("All tasks")}
              />
            </div>
          </aside>
        </div>
      </div>

      <CreateTaskDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreateTaskSubmit}
      />
      <TaskDetailsDialog
  task={selectedTask}
  onClose={() => setSelectedTask(null)}
  onStatusChange={handleTaskStatusChange}
/>
    </main>
  );
}
