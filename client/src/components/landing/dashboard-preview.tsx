
import {
  Activity,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  Mail,
  MoreHorizontal,
  Search,
  Settings2,
  Users,
} from "lucide-react";

const navigation = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "All tasks", icon: ListTodo, active: false },
  { label: "Assigned to me", icon: Users, active: false },
  { label: "Created by me", icon: FolderKanban, active: false },
  { label: "Completed", icon: CheckCircle2, active: false },
];

const metrics = [
  {
    label: "Open tasks",
    value: "24",
    note: "Across your workspace",
    icon: ListTodo,
    surface: "bg-[#F0E6D6]",
    iconColor: "text-[#75563B]",
  },
  {
    label: "In progress",
    value: "08",
    note: "4 due soon",
    icon: Activity,
    surface: "bg-[#DFE8EB]",
    iconColor: "text-[#476875]",
  },
  {
    label: "Completed",
    value: "12",
    note: "Progress is on track",
    icon: CheckCircle2,
    surface: "bg-[#E1EADD]",
    iconColor: "text-[#31553D]",
  },
  {
    label: "High priority",
    value: "04",
    note: "Needs attention",
    icon: Clock3,
    surface: "bg-[#F0DED5]",
    iconColor: "text-[#914F38]",
  },
];

const tasks = [
  {
    title: "Finalize product launch checklist",
    project: "Product",
    initials: "AM",
    avatar: "bg-[#E5D5C0] text-[#684D36]",
    due: "Today",
    status: "In progress",
    statusColor: "bg-[#DFE8EB] text-[#3D6472]",
    priority: "High",
    priorityColor: "text-[#914F38]",
  },
  {
    title: "Review the new landing page",
    project: "Design",
    initials: "SK",
    avatar: "bg-[#E5D9E8] text-[#725579]",
    due: "Tomorrow",
    status: "Pending",
    statusColor: "bg-[#F0E6D6] text-[#75563B]",
    priority: "Medium",
    priorityColor: "text-[#94713A]",
  },
  {
    title: "Prepare the weekly team report",
    project: "Operations",
    initials: "RP",
    avatar: "bg-[#DDE8D8] text-[#31553D]",
    due: "Oct 30",
    status: "Completed",
    statusColor: "bg-[#E1EADD] text-[#31553D]",
    priority: "Low",
    priorityColor: "text-[#5B665D]",
  },
  {
    title: "Document the API workflow",
    project: "Development",
    initials: "JM",
    avatar: "bg-[#E2DCEB] text-[#65547E]",
    due: "Nov 02",
    status: "In progress",
    statusColor: "bg-[#DFE8EB] text-[#3D6472]",
    priority: "Medium",
    priorityColor: "text-[#94713A]",
  },
];

const weekdays = ["M", "T", "W", "T", "F", "S", "S"];

const calendarDays = [
  "", "", "", "1", "2", "3", "4",
  "5", "6", "7", "8", "9", "10", "11",
  "12", "13", "14", "15", "16", "17", "18",
  "19", "20", "21", "22", "23", "24", "25",
  "26", "27", "28", "29", "30", "31", "",
];

const deadlines = [
  {
    title: "Review landing page",
    meta: "Design · Tomorrow",
    priority: "Medium",
    color: "bg-[#DDE7E9] text-[#456875]",
  },
  {
    title: "Product launch checklist",
    meta: "Product · Today",
    priority: "High",
    color: "bg-[#F0DED5] text-[#914F38]",
  },
  {
    title: "Weekly team report",
    meta: "Operations · Oct 30",
    priority: "Low",
    color: "bg-[#E1EADD] text-[#31553D]",
  },
];

function PreviewTaskRow({
  task,
}: {
  task: (typeof tasks)[number];
}) {
  return (
    <div className="dashboard-task-row grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3 py-3.5 sm:px-4">
      <div className="flex min-w-0 items-center gap-3">
        <span
          className={`hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:flex ${task.avatar}`}
        >
          <Check size={16} />
        </span>

        <div className="min-w-0">
          <p className="break-words text-xs font-semibold leading-5 text-[#263129] sm:text-sm">
            {task.title}
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-[#687166]">
            <span>{task.project}</span>
            <span className="text-[#BBB5A9]">•</span>
            <span>Due {task.due}</span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 sm:hidden">
            <span
              className={`rounded-md px-2 py-1 text-[10px] font-medium ${task.statusColor}`}
            >
              {task.status}
            </span>
            <span className={`text-[10px] font-semibold ${task.priorityColor}`}>
              {task.priority}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`hidden rounded-md px-2 py-1 text-[10px] font-medium md:inline-flex ${task.statusColor}`}
        >
          {task.status}
        </span>

        <span
          className={`hidden min-w-[45px] text-right text-[10px] font-semibold sm:block ${task.priorityColor}`}
        >
          {task.priority}
        </span>

        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${task.avatar}`}
          aria-label={`Example assignee ${task.initials}`}
        >
          {task.initials}
        </span>
      </div>
    </div>
  );
}

function MiniCalendar() {
  return (
    <section className="rounded-2xl border border-[#E9E4D9] bg-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-sm font-bold text-[#263129]">
            Team calendar
          </h3>
          <p className="mt-1 text-[10px] text-[#697366]">
            Example schedule
          </p>
        </div>

        <CalendarDays size={17} className="text-[#47634E]" />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs font-semibold text-[#36463A]">
          This month
        </span>
        <span className="text-[10px] text-[#7B8276]">
          Monthly view
        </span>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-y-1.5">
        {weekdays.map((day, index) => (
          <span
            key={`${day}-${index}`}
            className="pb-1 text-center text-[9px] font-semibold text-[#8B9085]"
          >
            {day}
          </span>
        ))}

        {calendarDays.map((day, index) => {
          const selected = day === "14";
          const hasTask = ["8", "21", "29"].includes(day);

          return (
            <span
              key={`${day}-${index}`}
              className={`relative mx-auto flex h-7 w-7 items-center justify-center rounded-full text-[10px] ${
                selected
                  ? "bg-[#244A3D] font-bold text-white"
                  : day
                    ? "text-[#525E53]"
                    : "text-transparent"
              }`}
            >
              {day}

              {hasTask && !selected && (
                <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-[#A45D42]" />
              )}
            </span>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-[#EEEAE1] pt-3 text-[10px] text-[#697366]">
        <span className="h-2 w-2 rounded-full bg-[#A45D42]" />
        Upcoming task deadlines
      </div>
    </section>
  );
}

function DeadlineList() {
  return (
    <section className="rounded-2xl border border-[#E9E4D9] bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-heading text-sm font-bold text-[#263129]">
          Upcoming deadlines
        </h3>
        <MoreHorizontal size={17} className="text-[#687166]" />
      </div>

      <div className="mt-3 space-y-3">
        {deadlines.map((item) => (
          <div key={item.title} className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F0F0E8] text-[#47634E]">
              <CalendarDays size={14} />
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold leading-4 text-[#263129]">
                {item.title}
              </p>
              <p className="mt-1 text-[9px] text-[#7B8276]">
                {item.meta}
              </p>
              <span className={`mt-1.5 inline-flex rounded px-1.5 py-0.5 text-[9px] font-semibold ${item.color}`}>
                {item.priority}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function DashboardPreview() {
  return (
    <section
      aria-label="Illustrative Hairdrama Tasks dashboard preview"
      className="relative z-20 mx-auto -mt-14 max-w-[1440px] px-3 pb-20 sm:-mt-20 sm:px-6 lg:-mt-24 lg:px-10"
    >
      <div className="dashboard-preview-shell rounded-[24px] border border-[#244A3D] bg-[#244A3D] p-2 shadow-[0_32px_100px_-42px_rgba(32,40,33,.36)] sm:rounded-[30px] sm:p-3">
        <div className="overflow-hidden rounded-[18px] border border-[#DADCCF] bg-[#F4F2EB] sm:rounded-[23px]">
          <div className="grid lg:grid-cols-[178px_minmax(0,1fr)] xl:grid-cols-[190px_minmax(0,1fr)_265px]">
            {/* Left navigation */}
            <aside className="hidden flex-col bg-[#244A3D] p-4 text-[#F8F7F2] lg:flex lg:p-5">
              <div className="flex items-center gap-2.5 border-b border-white/15 pb-5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0E6D6] text-[#244A3D]">
                  <CheckCircle2 size={19} />
                </span>

                <span className="font-heading text-sm font-bold tracking-tight">
                  Hairdrama
                  <span className="mt-0.5 block text-[9px] font-medium tracking-[.13em] text-[#D0DBCC]">
                    TASK WORKSPACE
                  </span>
                </span>
              </div>

              <p className="mb-3 mt-6 text-[9px] font-bold uppercase tracking-[.16em] text-[#C2D1BD]">
                Workspace
              </p>

              <nav className="space-y-1" aria-label="Preview task navigation">
                {navigation.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-[11px] font-medium ${
                        item.active
                          ? "bg-[#E2EADD] text-[#244A3D]"
                          : "text-[#DFE8DA]"
                      }`}
                    >
                      <Icon size={15} />
                      <span>{item.label}</span>
                    </div>
                  );
                })}
              </nav>

              <div className="mt-auto pt-10">
                <div className="rounded-xl border border-white/15 bg-[#315943] p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#DCE8D6] text-[#244A3D]">
                    <CheckCircle2 size={16} />
                  </div>
                  <p className="mt-3 text-xs font-semibold">
                    Keep work moving
                  </p>
                  <p className="mt-1 text-[10px] leading-4 text-[#DCE8D6]">
                    Clear priorities. Visible progress.
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-white/15 pt-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D8C8A6] text-[10px] font-bold text-[#3D3529]">
                    AM
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold">Alex Morgan</p>
                    <p className="mt-0.5 text-[9px] text-[#CFDCCB]">
                      Workspace member
                    </p>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main task workspace */}
            <main className="min-w-0">
              <header className="preview-wave-surface border-b border-[#D8DCCF] bg-[#E8E8DE]">
                <div className="preview-wave-content flex flex-wrap items-center justify-between gap-3 px-3 py-4 sm:px-4 lg:px-5">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[.16em] text-[#607360]">
                      YOUR WORKSPACE
                    </p>
                    <h2 className="mt-1.5 font-heading text-lg font-bold tracking-tight text-[#202821] sm:text-xl">
                      Good morning, Alex.
                    </h2>
                    <p className="mt-1 text-[10px] text-[#5B665D] sm:text-xs">
                      Here&apos;s what needs your attention.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="hidden items-center gap-2 rounded-xl border border-white/90 bg-white/85 px-3 py-2.5 text-[10px] text-[#7A8176] md:flex">
                      <Search size={14} />
                      Search tasks...
                    </div>

                    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/90 bg-white/90 text-[#47634E]">
                      <Bell size={16} />
                    </span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D8C8A6] text-[10px] font-bold text-[#3D3529]">
                      AM
                    </span>
                    <ChevronDown size={13} className="text-[#5B665D]" />
                  </div>
                </div>
              </header>

              <div className="space-y-4 p-3 sm:p-4 lg:p-5">
                {/* Welcome panel */}
                <section className="relative overflow-hidden rounded-2xl border border-[#E7E1D5] bg-white p-4 sm:p-5">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-12 -top-20 h-48 w-48 rounded-full bg-[#E1EADD]/80 blur-2xl"
                  />

                  <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="max-w-md">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E8EFE4] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.1em] text-[#31553D]">
                        <CheckCircle2 size={12} />
                        Your daily overview
                      </span>

                      <h3 className="mt-3 font-heading text-base font-bold tracking-tight text-[#202821] sm:text-lg">
                        Make progress, one task at a time.
                      </h3>

                      <p className="mt-1.5 text-[11px] leading-5 text-[#687166]">
                        Review priorities, keep deadlines in sight and know what comes next.
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 self-start rounded-xl bg-[#244A3D] px-3.5 py-2.5 text-[10px] font-semibold text-white shadow-sm sm:self-center">
                      <ListTodo size={14} />
                      Task workspace
                    </div>
                  </div>
                </section>

                {/* Metric cards */}
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
                  {metrics.map((metric) => {
                    const Icon = metric.icon;

                    return (
                      <article
                        key={metric.label}
                        className={`dashboard-metric-card min-w-0 rounded-xl border border-black/[.035] p-3 text-[#202821] sm:rounded-2xl sm:p-3.5 ${metric.surface}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className={`flex h-8 w-8 items-center justify-center rounded-lg bg-white/75 ${metric.iconColor}`}>
                            <Icon size={16} />
                          </span>
                          <MoreHorizontal size={15} className="text-[#72776B]" />
                        </div>

                        <p className="mt-3 font-heading text-2xl font-bold tracking-tight sm:text-[28px]">
                          {metric.value}
                        </p>

                        <p className="mt-0.5 text-[10px] font-semibold sm:text-xs">
                          {metric.label}
                        </p>

                        <p className="mt-2 text-[9px] leading-4 text-[#5B665D]">
                          {metric.note}
                        </p>
                      </article>
                    );
                  })}
                </div>

                {/* Recent tasks */}
                <section className="overflow-hidden rounded-2xl border border-[#E5E0D5] bg-white">
                  <div className="flex items-center justify-between gap-3 border-b border-[#EEEAE1] px-3 py-3.5 sm:px-4">
                    <div>
                      <h3 className="font-heading text-sm font-bold text-[#263129]">
                        Recent tasks
                      </h3>
                      <p className="mt-1 text-[10px] text-[#7B8276]">
                        A sample of your team's work
                      </p>
                    </div>

                    <span className="whitespace-nowrap rounded-full border border-[#E5E0D5] bg-[#F8F7F2] px-3 py-1.5 text-[10px] font-semibold text-[#244A3D]">
                      View all →
                    </span>
                  </div>

                  <div className="divide-y divide-[#EEEAE1]">
                    {tasks.map((task) => (
                      <PreviewTaskRow key={task.title} task={task} />
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t border-[#EEEAE1] bg-[#FCFBF7] px-4 py-3">
                    <span className="text-[10px] text-[#747C70]">
                      Showing example tasks
                    </span>
                    <span className="text-[10px] font-semibold text-[#244A3D]">
                      Task overview
                    </span>
                  </div>
                </section>

                {/* Bottom activity strip */}
                <section className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-[#DDE5D8] bg-[#E7EDE2] p-3.5">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/85 text-[#31553D]">
                        <Activity size={15} />
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

                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/90">
                      <div className="h-full w-[68%] rounded-full bg-[#41694D]" />
                    </div>

                    <div className="mt-1.5 flex justify-between text-[9px] text-[#5B665D]">
                      <span>Work completed</span>
                      <span className="font-bold text-[#31553D]">68%</span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#E5D9CA] bg-[#F2E8DD] p-3.5">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/85 text-[#8A4528]">
                        <Mail size={15} />
                      </span>
                      <div>
                        <p className="text-xs font-bold text-[#66452F]">
                          Task notifications
                        </p>
                        <p className="text-[9px] text-[#776557]">
                          Email updates for key events
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 text-[10px] leading-5 text-[#664F3F]">
                      Created tasks and completed work can keep the right people informed.
                    </p>
                  </div>
                </section>
              </div>
            </main>

            {/* Right profile, calendar and reminder panel */}
            <aside className="hidden min-w-0 border-l border-[#E5E0D5] bg-[#FBFAF6] p-4 xl:block">
              <section className="rounded-2xl border border-[#E9E4D9] bg-white p-4 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#E4EBDD] bg-[#D8C8A6] font-heading text-lg font-bold text-[#3D3529]">
                  AM
                </span>

                <h3 className="mt-3 font-heading text-sm font-bold text-[#263129]">
                  Alex Morgan
                </h3>
                <p className="mt-1 text-[10px] text-[#788074]">
                  Workspace member
                </p>

                <div className="mt-3 flex items-center justify-center gap-1.5 rounded-lg bg-[#E8EFE4] px-2 py-2 text-[10px] font-semibold text-[#31553D]">
                  <CheckCircle2 size={13} />
                  Task progress at a glance
                </div>
              </section>

              <div className="mt-3">
                <MiniCalendar />
              </div>

              <div className="mt-3">
                <DeadlineList />
              </div>

              <div className="mt-3 flex items-center gap-2 rounded-xl border border-[#E5D9CA] bg-[#F2E8DD] p-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/85 text-[#8A4528]">
                  <Settings2 size={15} />
                </span>
                <div>
                  <p className="text-[10px] font-bold text-[#66452F]">
                    Stay organized
                  </p>
                  <p className="mt-0.5 text-[9px] text-[#776557]">
                    Clear tasks, fewer surprises.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-[10px] text-[#687166]">
        Illustrative dashboard preview · Sample values, not live user data
      </p>
    </section>
  );
}
