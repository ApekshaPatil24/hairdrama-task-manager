import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  ListTodo,
  MoreHorizontal,
  Target,
  type LucideIcon,
} from "lucide-react";
import type { DashboardTask } from "@/components/dashboard/types";

type DashboardStatsProps = {
  tasks: DashboardTask[];
  loading: boolean;
};

type Metric = {
  label: string;
  value: number;
  detail: string;
  icon: LucideIcon;
  surface: string;
  iconSurface: string;
  accent: string;
  trendIcon: LucideIcon;
};

export default function DashboardStats({ tasks, loading }: DashboardStatsProps) {
  const completedCount = tasks.filter((task) => task.status === "Completed").length;
  const inProgressCount = tasks.filter((task) => task.status === "In Progress").length;
  const highPriorityCount = tasks.filter(
    (task) => task.priority === "High" && task.status !== "Completed",
  ).length;

  const metrics: Metric[] = [
    {
      label: "Total tasks",
      value: tasks.length,
      detail: "Your accessible tasks",
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

  return (
    <section aria-labelledby="workspace-overview-heading">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[.15em] text-[#7A8176]">
            YOUR WORK AT A GLANCE
          </p>
          <h2 id="workspace-overview-heading" className="mt-1 font-heading text-lg font-bold tracking-tight text-[#202821]">
            Workspace overview
          </h2>
        </div>

        <span className="hidden items-center gap-1.5 text-[10px] text-[#697366] sm:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-[#739273]" />
          Live database data
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const TrendIcon = metric.trendIcon;

          return (
            <article key={metric.label} className={`dashboard-stat-card rounded-2xl border border-[#E6E2D8] p-4 sm:p-5 ${metric.surface}`}>
              <div className="flex items-start justify-between gap-2">
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${metric.iconSurface}`}>
                  <Icon size={19} strokeWidth={1.8} />
                </span>
                <MoreHorizontal size={17} className="text-[#909487]" />
              </div>

              <p className="mt-4 font-heading text-[28px] font-bold tracking-tight text-[#202821] sm:text-[32px]">
                {loading ? "—" : String(metric.value).padStart(2, "0")}
              </p>
              <p className="mt-0.5 text-xs font-semibold text-[#303A31]">{metric.label}</p>
              <div className={`mt-3 flex items-center gap-1 text-[10px] ${metric.accent}`}>
                <TrendIcon size={12} />
                <span>{metric.detail}</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
