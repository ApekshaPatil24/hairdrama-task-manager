import { Activity, ShieldCheck } from "lucide-react";
import type { DashboardTask } from "@/components/dashboard/types";

type DashboardInsightsProps = {
  tasks: DashboardTask[];
};

export default function DashboardInsights({ tasks }: DashboardInsightsProps) {
  const completedCount = tasks.filter((task) => task.status === "Completed").length;
  const completionPercentage = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;

  return (
    <section className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl border border-[#DDE5D8] bg-[#E7EDE2] p-4">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/85 text-[#31553D]">
            <Activity size={16} />
          </span>
          <div>
            <p className="text-xs font-bold text-[#244A3D]">Your progress</p>
            <p className="text-[9px] text-[#5B665D]">Based on your accessible tasks</p>
          </div>
        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white">
          <div className="h-full rounded-full bg-[#41694D] transition-all duration-300" style={{ width: `${completionPercentage}%` }} />
        </div>
        <div className="mt-1.5 flex justify-between text-[9px] text-[#5B665D]">
          <span>Tasks completed</span>
          <span className="font-bold text-[#31553D]">{completionPercentage}%</span>
        </div>
      </div>

      <div className="rounded-xl border border-[#E5D9CA] bg-[#F2E8DD] p-4">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/85 text-[#8A4528]">
            <ShieldCheck size={16} />
          </span>
          <div>
            <p className="text-xs font-bold text-[#66452F]">Task notifications</p>
            <p className="text-[9px] text-[#776557]">Stay informed about work</p>
          </div>
        </div>
        <p className="mt-3 text-[10px] leading-5 text-[#664F3F]">
          Email notifications will be connected in the notification integration step.
        </p>
      </div>
    </section>
  );
}
