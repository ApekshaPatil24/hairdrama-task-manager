import { ArrowRight, Plus, Sparkles } from "lucide-react";
import TaskBuddy from "@/components/dashboard/illustrations/task-buddy";

type DashboardWelcomeProps = {
  firstName: string;
  onCreateTask: () => void;
  onExploreTasks: () => void;
};

export default function DashboardWelcome({
  firstName,
  onCreateTask,
  onExploreTasks,
}: DashboardWelcomeProps) {
  return (
    <section className="dashboard-welcome-surface relative isolate overflow-hidden rounded-[24px] bg-[#244A3D] p-5 text-white shadow-[0_16px_40px_-28px_rgba(36,74,61,.55)] sm:p-7 lg:p-8">
      <div className="relative z-10 max-w-[610px]">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3 py-1.5 text-[10px] font-medium text-[#E3EBDD]">
          <Sparkles size={13} className="text-[#D8C8A6]" />
          YOUR SPACE TO MAKE PROGRESS
        </span>

        <h2 className="mt-4 max-w-[520px] font-heading text-[26px] font-semibold leading-tight tracking-[-.04em] sm:text-[32px] lg:text-[38px]">
          Good to see you, <span className="font-accent font-normal italic text-[#E3C9A0]">{firstName}.</span>
        </h2>

        <p className="mt-3 max-w-[460px] text-xs leading-6 text-[#DCE7D8] sm:text-sm sm:leading-7">
          Small steps make meaningful progress. Here&apos;s what&apos;s happening in your workspace today.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onCreateTask}
            className="inline-flex items-center gap-2 rounded-xl bg-[#F8F7F2] px-4 py-2.5 text-xs font-semibold text-[#244A3D] shadow-sm transition hover:-translate-y-0.5 hover:bg-[#E6EDE4]"
          >
            <Plus size={15} />
            Create task
          </button>

          <button
            type="button"
            onClick={onExploreTasks}
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
  );
}
