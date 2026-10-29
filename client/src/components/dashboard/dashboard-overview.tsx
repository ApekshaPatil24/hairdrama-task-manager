
"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Circle,
  ListTodo,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  X,
  type LucideIcon,
} from "lucide-react";

import DashboardSidebar, {
  type DashboardView,
} from "@/components/dashboard/layout/1. dashboard-sidebar";

import DashboardTopbar from "@/components/dashboard/layout/2. dashboard-topbar";

import DashboardRightSidebar, {
  type RightSidebarTask,
} from "@/components/dashboard/layout/3. dashboard-right-sidebar";

type TaskStatus = "Pending" | "In Progress" | "Completed";
type TaskPriority = "Low" | "Medium" | "High";

type Task = {
  id: string;
  title: string;
  project: string;
  assignee: string;
  initials: string;
  createdBy: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
};

type DashboardOverviewProps = {
  userName: string;
  userEmail: string;
};

function dateAfter(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDateLabel(dateString: string | null) {
  if (!dateString) return "No deadline";

  const selected = new Date(`${dateString}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (selected.getTime() === today.getTime()) return "Today";
  if (selected.getTime() === tomorrow.getTime()) return "Tomorrow";

  return selected.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

function getInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "U"
  );
}

/* Demonstration content only. This is not database data. */
const initialTasks: Task[] = [
  {
    id: "demo-1",
    title: "Finalize product launch checklist",
    project: "Product",
    assignee: "Jordan Lee",
    initials: "JL",
    createdBy: "You",
    status: "In Progress",
    priority: "High",
    dueDate: dateAfter(0),
  },
  {
    id: "demo-2",
    title: "Review the new landing page",
    project: "Design",
    assignee: "You",
    initials: "ME",
    createdBy: "Jordan Lee",
    status: "Pending",
    priority: "Medium",
    dueDate: dateAfter(1),
  },
  {
    id: "demo-3",
    title: "Prepare the weekly team report",
    project: "Operations",
    assignee: "You",
    initials: "ME",
    createdBy: "You",
    status: "Completed",
    priority: "Low",
    dueDate: dateAfter(2),
  },
  {
    id: "demo-4",
    title: "Document the API workflow",
    project: "Development",
    assignee: "Riya Patel",
    initials: "RP",
    createdBy: "You",
    status: "In Progress",
    priority: "Medium",
    dueDate: dateAfter(4),
  },
  {
    id: "demo-5",
    title: "Review onboarding requirements",
    project: "Product",
    assignee: "Avery Morgan",
    initials: "AM",
    createdBy: "Jordan Lee",
    status: "Pending",
    priority: "Low",
    dueDate: dateAfter(6),
  },
];

/* Custom task-management mascot illustration */
function TaskBuddy() {
  return (
    <svg
      viewBox="0 0 180 160"
      fill="none"
      aria-hidden="true"
      className="dashboard-mascot h-[118px] w-[130px] sm:h-[145px] sm:w-[164px]"
    >
      <ellipse cx="93" cy="144" rx="62" ry="9" fill="#132C21" opacity=".16" />

      <circle cx="91" cy="77" r="67" fill="#A8C0A4" opacity=".12" />
      <circle
        cx="91"
        cy="77"
        r="53"
        stroke="#D8C8A6"
        strokeOpacity=".45"
        strokeDasharray="3 7"
      />

      <rect
        x="48"
        y="24"
        width="79"
        height="111"
        rx="15"
        fill="#F8F7F2"
        stroke="#D8C8A6"
        strokeWidth="2"
      />

      <rect x="70" y="17" width="35" height="15" rx="6" fill="#D8C8A6" />
      <rect x="79" y="21" width="17" height="5" rx="2.5" fill="#244A3D" />

      <rect x="60" y="46" width="15" height="15" rx="4" fill="#244A3D" />
      <path
        d="m64 53 3 3 5-6"
        stroke="#F8F7F2"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M83 53h28"
        stroke="#A8C0A4"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <rect x="60" y="70" width="15" height="15" rx="4" fill="#E9D8C9" />
      <path
        d="M83 77h22"
        stroke="#C8CFC2"
        strokeWidth="4"
        strokeLinecap="round"
      />

      <circle cx="80" cy="105" r="17" fill="#D8C8A6" />
      <circle cx="74" cy="102" r="1.9" fill="#244A3D" />
      <circle cx="86" cy="102" r="1.9" fill="#244A3D" />
      <path
        d="M74 108q6 8 12 0"
        stroke="#8A4528"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <path
        d="M48 84 36 94 44 103"
        stroke="#D8C8A6"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M127 83 138 94 131 101"
        stroke="#D8C8A6"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle cx="25" cy="40" r="13" fill="#E4D4BC" />
      <path
        d="m25 33 2.2 5.3 5.3 2.2-5.3 2.2L25 48l-2.2-5.3-5.3-2.2 5.3-2.2L25 33Z"
        fill="#8A4528"
      />

      <path
        d="M142 48h9m-4.5-4.5v9"
        stroke="#D8C8A6"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="148" cy="122" r="4" fill="#A8C0A4" />
    </svg>
  );
}

export default function DashboardOverview({
  userName,
  userEmail,
}: DashboardOverviewProps) {
  const [activeView, setActiveView] = useState<DashboardView>("Overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const firstName = userName.trim().split(/\s+/)[0] || "there";
  const userInitials = getInitials(userName);

  const rightSidebarTasks = useMemo<RightSidebarTask[]>(
    () =>
      tasks
        .filter(
          (task): task is Task & { dueDate: string } =>
            task.dueDate !== null && task.status !== "Completed"
        )
        .map((task) => ({
          id: task.id,
          title: task.title,
          dueDate: task.dueDate,
          meta: `${task.priority} priority · ${task.assignee}`,
        })),
    [tasks]
  );

  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        !query ||
        task.title.toLowerCase().includes(query) ||
        task.project.toLowerCase().includes(query) ||
        task.assignee.toLowerCase().includes(query);

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

  const completedCount = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const inProgressCount = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const highPriorityCount = tasks.filter(
    (task) => task.priority === "High" && task.status !== "Completed"
  ).length;

  const metrics: {
    label: string;
    value: number;
    detail: string;
    icon: LucideIcon;
    surface: string;
    iconSurface: string;
    accent: string;
    trendIcon: LucideIcon;
  }[] = [
    {
      label: "Total tasks",
      value: tasks.length,
      detail: "Across the workspace",
      icon: ListTodo,
      surface: "bg-white",
      iconSurface: "bg-[#E2EADD] text-[#31553D]",
      accent: "text-[#31553D]",
      trendIcon: ArrowUpRight,
    },
    {
      label: "In progress",
      value: inProgressCount,
      detail: "Work underway",
      icon: Activity,
      surface: "bg-[#E1E8EB]",
      iconSurface: "bg-white/80 text-[#4B6878]",
      accent: "text-[#4B6878]",
      trendIcon: ArrowUpRight,
    },
    {
      label: "Completed",
      value: completedCount,
      detail: "Marked as done",
      icon: CheckCircle2,
      surface: "bg-[#E4ECDF]",
      iconSurface: "bg-white/80 text-[#31553D]",
      accent: "text-[#31553D]",
      trendIcon: Check,
    },
    {
      label: "High priority",
      value: highPriorityCount,
      detail: "Needs attention",
      icon: Target,
      surface: "bg-[#F2E5DB]",
      iconSurface: "bg-white/80 text-[#94563E]",
      accent: "text-[#94563E]",
      trendIcon: ArrowDownRight,
    },
  ];

  function selectView(view: DashboardView) {
    setActiveView(view);
    setNotice("");
  }

  function updateTaskStatus(id: string) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, status: "Completed" } : task
      )
    );

    setNotice(
      "Updated in this local preview only. The change has not been saved to the database."
    );
  }

  function createTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const title = String(formData.get("title") ?? "").trim();
    if (!title) return;

    const assignee = String(formData.get("assignee") ?? "You");
    const priority = String(formData.get("priority") ?? "Medium") as TaskPriority;
    const rawDueDate = String(formData.get("dueDate") ?? "");

    const newTask: Task = {
      id: `local-${Date.now()}`,
      title,
      project: "General",
      assignee,
      initials: assignee === "You" ? userInitials : getInitials(assignee),
      createdBy: "You",
      status: "Pending",
      priority,
      dueDate: rawDueDate || null,
    };

    setTasks((current) => [newTask, ...current]);
    setActiveView("All tasks");
    setSearchQuery("");
    setCreateOpen(false);
    setNotice(
      "Task added to this preview session only. It has not been saved to Flask or Supabase."
    );
  }

  function showTaskList() {
    setActiveView("All tasks");

    document.getElementById("dashboard-tasks")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <main className="dashboard-page min-h-svh w-full p-0 text-[#202821]">
      <div className="mx-auto grid min-h-svh w-full max-w-[1800px] overflow-hidden bg-[#F8F7F2] lg:grid-cols-[240px_minmax(0,1fr)]">
        {/* Desktop sidebar: slightly wider with more comfortable navigation spacing */}
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

        {/* Workspace stage: topbar spans both the main content and right planner */}
        <div className="grid min-w-0 grid-cols-1 items-start xl:grid-cols-[minmax(0,1fr)_330px]">
          <div className="min-w-0 h-[83px] min-h-[83px] xl:col-span-2">
            <DashboardTopbar
              userName={userName}
              userEmail={userEmail}
              activeView={activeView}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onMenuClick={() => setMobileNavOpen(true)}
              onNotificationClick={() =>
                setNotice(
                  "Task notifications will appear here once notification integration is connected."
                )
              }
            />
          </div>

          {/* Main dashboard content */}
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
              <div
                role="status"
                className="flex items-start justify-between gap-3 rounded-xl border border-[#D9DDCE] bg-[#F0F2E9] px-4 py-3 text-xs leading-5 text-[#46574A]"
              >
                <span>{notice}</span>
                <button
                  type="button"
                  onClick={() => setNotice("")}
                  aria-label="Dismiss notice"
                  className="shrink-0 rounded p-1 hover:bg-white"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Welcome banner */}
            <section className="dashboard-welcome-surface relative isolate overflow-hidden rounded-[24px] bg-[#244A3D] p-5 text-white shadow-[0_16px_40px_-28px_rgba(36,74,61,.55)] sm:p-7 lg:p-8">
              <div className="relative z-10 max-w-[610px]">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-[10px] font-medium text-[#E3EBDD]">
                  <Sparkles size={13} className="text-[#D8C8A6]" />
                  YOUR SPACE TO MAKE PROGRESS
                </span>

                <h2 className="mt-4 max-w-[520px] font-heading text-[26px] font-semibold leading-tight tracking-[-.04em] sm:text-[32px] lg:text-[38px]">
                  Good to see you,{" "}
                  <span className="font-accent font-normal italic text-[#E3C9A0]">
                    {firstName}.
                  </span>
                </h2>

                <p className="mt-3 max-w-[460px] text-xs leading-6 text-[#DCE7D8] sm:text-sm sm:leading-7">
                  Small steps make meaningful progress. Here&apos;s
                  what&apos;s happening in your workspace today.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setCreateOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#F8F7F2] px-4 py-2.5 text-xs font-semibold text-[#244A3D] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#E6EDE4]"
                  >
                    <Plus size={15} />
                    Create task
                  </button>

                  <button
                    type="button"
                    onClick={showTaskList}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-4 py-2.5 text-xs font-medium text-white transition hover:bg-white/[0.12]"
                  >
                    Explore tasks
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              <div className="pointer-events-none absolute bottom-0 right-3 z-0 hidden sm:block lg:right-10">
                <TaskBuddy />
              </div>

              <div className="pointer-events-none absolute -right-12 -top-20 -z-10 h-60 w-60 rounded-full border border-white/10" />
              <div className="pointer-events-none absolute -right-2 -top-10 -z-10 h-40 w-40 rounded-full border border-[#D8C8A6]/15" />
            </section>

            {/* Statistics */}
            <section>
              <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[.15em] text-[#7A8176]">
                    YOUR WORK AT A GLANCE
                  </p>
                  <h2 className="mt-1 font-heading text-lg font-bold tracking-tight text-[#202821]">
                    Workspace overview
                  </h2>
                </div>

                <span className="hidden items-center gap-1.5 text-[10px] text-[#697366] sm:inline-flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#739273]" />
                  Preview data
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                {metrics.map((metric) => {
                  const Icon = metric.icon;
                  const TrendIcon = metric.trendIcon;

                  return (
                    <article
                      key={metric.label}
                      className={`dashboard-stat-card rounded-2xl border border-[#E6E2D8] p-4 sm:p-5 ${metric.surface}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${metric.iconSurface}`}>
                          <Icon size={19} strokeWidth={1.8} />
                        </span>
                        <MoreHorizontal size={17} className="text-[#909487]" />
                      </div>

                      <p className="mt-4 font-heading text-[28px] font-bold tracking-tight text-[#202821] sm:text-[32px]">
                        {String(metric.value).padStart(2, "0")}
                      </p>

                      <p className="mt-0.5 text-xs font-semibold text-[#303A31]">
                        {metric.label}
                      </p>

                      <div className={`mt-3 flex items-center gap-1 text-[10px] ${metric.accent}`}>
                        <TrendIcon size={12} />
                        <span>{metric.detail}</span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* Task list */}
            <section
              id="dashboard-tasks"
              className="scroll-mt-24 overflow-hidden rounded-2xl border border-[#E5E0D5] bg-white"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EEEAE1] px-4 py-4 sm:px-5">
                <div>
                  <h2 className="font-heading text-base font-bold text-[#202821]">
                    {activeView === "Overview" ? "Recent tasks" : activeView}
                  </h2>
                  <p className="mt-1 text-[10px] text-[#7A8176]">
                    Keep an eye on what needs to happen next.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setCreateOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#244A3D] px-3 py-2.5 text-[10px] font-semibold text-white transition hover:bg-[#19382E]"
                >
                  <Plus size={14} />
                  New task
                </button>
              </div>

              <div className="flex gap-1.5 overflow-x-auto border-b border-[#EEEAE1] px-3 py-3 sm:px-4">
                {(
                  [
                    "All tasks",
                    "Assigned to me",
                    "Created by me",
                    "Completed",
                  ] as DashboardView[]
                ).map((view) => (
                  <button
                    key={view}
                    type="button"
                    onClick={() => selectView(view)}
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

              <div className="hidden grid-cols-[minmax(0,1.5fr)_105px_82px_82px_105px] items-center gap-2 bg-[#FBFAF6] px-5 py-3 text-[9px] font-semibold uppercase tracking-[.08em] text-[#858B7F] lg:grid">
                <span>Task</span>
                <span>Assignee</span>
                <span>Deadline</span>
                <span>Priority</span>
                <span>Status</span>
              </div>

              <div className="divide-y divide-[#EEEAE1]">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="dashboard-task-row grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3.5 py-4 sm:px-5 lg:grid-cols-[minmax(0,1.5fr)_105px_82px_82px_105px] lg:gap-2"
                  >
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
                          {task.project}
                        </p>

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
                            {getDateLabel(task.dueDate)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="hidden min-w-0 items-center gap-2 lg:flex">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E8D9C5] text-[9px] font-bold text-[#624B35]">
                        {task.initials}
                      </span>
                      <span className="truncate text-[10px] text-[#687166]">
                        {task.assignee}
                      </span>
                    </div>

                    <span className="hidden text-[10px] text-[#687166] lg:block">
                      {getDateLabel(task.dueDate)}
                    </span>

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

                    <div className="flex items-center justify-end gap-1.5 lg:justify-start">
                      {task.status !== "Completed" ? (
                        <button
                          type="button"
                          onClick={() => updateTaskStatus(task.id)}
                          title="Mark this demonstration task as completed"
                          className="hidden items-center gap-1 rounded-md border border-[#DDE5D8] bg-[#F3F6EF] px-2 py-1.5 text-[9px] font-semibold text-[#31553D] transition hover:bg-[#E2EADD] lg:inline-flex"
                        >
                          <Check size={11} />
                          Complete
                        </button>
                      ) : (
                        <span className="hidden rounded-md bg-[#E2EADD] px-2 py-1.5 text-[9px] font-semibold text-[#31553D] lg:inline-flex">
                          Done
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          setNotice(
                            `“${task.title}” is demonstration data. Task details will be connected to the API later.`
                          )
                        }
                        aria-label={`Details for ${task.title}`}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#828879] transition hover:bg-[#F3F2EA] hover:text-[#244A3D]"
                      >
                        <MoreHorizontal size={17} />
                      </button>
                    </div>
                  </div>
                ))}

                {filteredTasks.length === 0 && (
                  <div className="px-5 py-12 text-center">
                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8EDE4] text-[#31553D]">
                      <Search size={20} />
                    </span>

                    <h3 className="mt-4 font-heading text-sm font-bold text-[#293329]">
                      No matching tasks
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-[#7A8176]">
                      Try another search or select a different task view.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        selectView("All tasks");
                      }}
                      className="mt-4 rounded-lg bg-[#244A3D] px-3 py-2 text-xs font-semibold text-white hover:bg-[#19382E]"
                    >
                      Show all tasks
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-[#EEEAE1] bg-[#FBFAF6] px-4 py-3 sm:px-5">
                <span className="text-[10px] text-[#7A8176]">
                  {filteredTasks.length} tasks shown
                </span>

                <button
                  type="button"
                  onClick={() => setCreateOpen(true)}
                  className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#244A3D] hover:text-[#8A4528]"
                >
                  <Plus size={13} />
                  Add task
                </button>
              </div>
            </section>

            {/* Bottom activity panels */}
            <section className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[#DDE5D8] bg-[#E7EDE2] p-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/85 text-[#31553D]">
                    <Activity size={16} />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-[#244A3D]">
                      Team progress
                    </p>
                    <p className="text-[9px] text-[#5B665D]">
                      Illustrative completion rate
                    </p>
                  </div>
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-[#41694D] transition-all duration-300"
                    style={{
                      width: `${
                        tasks.length
                          ? (completedCount / tasks.length) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>

                <div className="mt-1.5 flex justify-between text-[9px] text-[#5B665D]">
                  <span>Tasks completed</span>
                  <span className="font-bold text-[#31553D]">
                    {tasks.length
                      ? Math.round((completedCount / tasks.length) * 100)
                      : 0}
                    %
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-[#E5D9CA] bg-[#F2E8DD] p-4">
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/85 text-[#8A4528]">
                    <ShieldCheck size={16} />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-[#66452F]">
                      Task notifications
                    </p>
                    <p className="text-[9px] text-[#776557]">
                      Stay informed about work
                    </p>
                  </div>
                </div>

                <p className="mt-3 text-[10px] leading-5 text-[#664F3F]">
                  Email updates will be connected when the notification
                  integration is implemented.
                </p>
              </div>
            </section>

            {/* Calendar and schedule stack below the main content on smaller screens */}
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

      {/* Fixed right planner */}
<aside
  className="
    dashboard-fixed-right-panel
    hidden min-w-0 border-l border-[#E5E0D5]
    bg-[#FBFAF6]
    xl:fixed xl:right-0 xl:top-[83px] xl:z-30
    xl:block xl:h-[calc(100dvh-83px)] xl:w-[330px]
    xl:overflow-y-auto
  "
>
  <div className="p-4 2xl:p-5">
    <DashboardRightSidebar
      tasks={rightSidebarTasks}
      onViewAll={() => selectView("All tasks")}
    />
  </div>
</aside>
        </div>
      </div>

      {/* Local-only create task dialog */}
      {createOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-[#19231D]/60 p-4 backdrop-blur-sm">
          <form
            onSubmit={createTask}
            className="my-auto w-full max-w-[450px] rounded-[24px] border border-[#E5E0D5] bg-[#F8F7F2] p-5 shadow-2xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E2EADD] text-[#31553D]">
                  <ListTodo size={19} />
                </span>

                <h2 className="mt-4 font-heading text-xl font-bold text-[#202821]">
                  Create a task
                </h2>

                <p className="mt-1 text-xs leading-5 text-[#687166]">
                  Add a task to the current dashboard preview.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                aria-label="Close create task dialog"
                className="rounded-xl p-2 text-[#687166] hover:bg-[#EDEBE2]"
              >
                <X size={18} />
              </button>
            </div>

            <label className="mt-5 block text-xs font-semibold text-[#34483A]">
              Task title *
              <input
                autoFocus
                required
                name="title"
                maxLength={200}
                placeholder="e.g. Review project requirements"
                className="mt-2 w-full rounded-xl border border-[#E1DED3] bg-white px-3.5 py-3 text-sm font-normal text-[#202821] outline-none placeholder:text-[#9BA094] focus:border-[#789477] focus:ring-2 focus:ring-[#789477]/15"
              />
            </label>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block text-xs font-semibold text-[#34483A]">
                Assignee
                <select
                  name="assignee"
                  defaultValue="You"
                  className="mt-2 w-full rounded-xl border border-[#E1DED3] bg-white px-3 py-3 text-xs font-normal text-[#202821] outline-none focus:border-[#789477]"
                >
                  <option value="You">You</option>
                  <option value="Jordan Lee">Jordan Lee</option>
                  <option value="Riya Patel">Riya Patel</option>
                  <option value="Avery Morgan">Avery Morgan</option>
                </select>
              </label>

              <label className="block text-xs font-semibold text-[#34483A]">
                Priority
                <select
                  name="priority"
                  defaultValue="Medium"
                  className="mt-2 w-full rounded-xl border border-[#E1DED3] bg-white px-3 py-3 text-xs font-normal text-[#202821] outline-none focus:border-[#789477]"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </label>
            </div>

            <label className="mt-4 block text-xs font-semibold text-[#34483A]">
              Due date
              <input
                name="dueDate"
                type="date"
                className="mt-2 w-full rounded-xl border border-[#E1DED3] bg-white px-3.5 py-3 text-xs font-normal text-[#202821] outline-none focus:border-[#789477]"
              />
            </label>

            <p className="mt-4 rounded-xl border border-[#E5D9CA] bg-[#F2E8DD] px-3 py-2.5 text-[10px] leading-5 text-[#75563B]">
              Preview only: tasks are stored in browser memory and are not saved to Flask or Supabase.
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="rounded-xl border border-[#E1DED3] bg-white px-4 py-3 text-xs font-semibold text-[#5B665D] hover:bg-[#F1F0E8]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-[#244A3D] px-4 py-3 text-xs font-semibold text-white transition hover:bg-[#19382E]"
              >
                <Plus size={14} />
                Add to preview
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
