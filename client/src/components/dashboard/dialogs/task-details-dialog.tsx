
"use client";

import { useEffect, useState, type FormEvent } from "react";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  ListTodo,
  LoaderCircle,
  UserRound,
  X,
} from "lucide-react";

import type { DashboardTask } from "@/components/dashboard/types";
import type { TaskStatus } from "@/lib/api/tasks";
import { useToast } from "@/components/ui/toast-provider";

type TaskDetailsDialogProps = {
  task: DashboardTask | null;
  onClose: () => void;
  onStatusChange: (status: TaskStatus) => Promise<void>;
};

const statusOptions: {
  value: TaskStatus;
  label: string;
}[] = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

function toApiStatus(status: string): TaskStatus {
  switch (status) {
    case "In Progress":
      return "in_progress";
    case "Completed":
      return "completed";
    default:
      return "pending";
  }
}

function getPriorityStyle(priority: string) {
  switch (priority) {
    case "High":
      return "bg-[#F2E5DB] text-[#94563E]";
    case "Medium":
      return "bg-[#F0E6D6] text-[#75563B]";
    default:
      return "bg-[#E8EDE4] text-[#526B51]";
  }
}

export default function TaskDetailsDialog({
  task,
  onClose,
  onStatusChange,
}: TaskDetailsDialogProps) {
  const { showToast } = useToast();

  const [selectedStatus, setSelectedStatus] =
    useState<TaskStatus>("pending");

  const [isUpdating, setIsUpdating] = useState(false);

  // Synchronize the selected status whenever another task is opened.
  useEffect(() => {
    if (task) {
      setSelectedStatus(toApiStatus(task.status));
    }
  }, [task?.id, task?.status]);

  // Keep hooks above the conditional return.
  if (!task) return null;

  const originalStatus = toApiStatus(task.status);
  const hasStatusChanged = selectedStatus !== originalStatus;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!hasStatusChanged) {
      showToast("No status changes to save.", "info");
      return;
    }

    setIsUpdating(true);

    try {
      await onStatusChange(selectedStatus);
      onClose();
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Unable to update task status.",
        "error"
      );
    } finally {
      setIsUpdating(false);
    }
  }

  const dueDateLabel = task.dueDate
    ? new Date(`${task.dueDate}T00:00:00`).toLocaleDateString(
        "en-IN",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        }
      )
    : "No due date";

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#17251f]/45 px-4 py-5 backdrop-blur-[5px]">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-details-heading"
        className="w-full max-w-[520px] overflow-hidden rounded-[24px] border border-[#e9e9df] bg-[#fffefa] shadow-[0_24px_80px_rgba(23,37,31,0.20)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#edede6] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#eaf0e9] text-[#315b48]">
              <ListTodo size={21} />
            </div>

            <div>
              <h2
                id="task-details-heading"
                className="text-lg font-semibold tracking-tight text-[#26382f]"
              >
                Task details
              </h2>

              <p className="mt-0.5 text-xs text-[#899087]">
                Review and manage your task.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isUpdating}
            aria-label="Close task details"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#7e887f] transition hover:bg-[#f0f1eb] disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>

        {/* Task information */}
        <div className="space-y-6 px-6 py-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#899087]">
              Task title
            </p>

            <h3 className="mt-2 break-words text-lg font-semibold leading-7 text-[#26382f]">
              {task.title}
            </h3>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[#edede6] bg-[#fbfaf6] p-3">
              <div className="flex items-center gap-2 text-[#899087]">
                <UserRound size={15} />
                <span className="text-[10px] font-medium">
                  Assigned to
                </span>
              </div>

              <p className="mt-2 truncate text-sm font-semibold text-[#35463a]">
                {task.assignee}
              </p>
            </div>

            <div className="rounded-xl border border-[#edede6] bg-[#fbfaf6] p-3">
              <div className="flex items-center gap-2 text-[#899087]">
                <CalendarDays size={15} />
                <span className="text-[10px] font-medium">
                  Due date
                </span>
              </div>

              <p className="mt-2 text-sm font-semibold text-[#35463a]">
                {dueDateLabel}
              </p>
            </div>

            <div className="rounded-xl border border-[#edede6] bg-[#fbfaf6] p-3">
              <div className="flex items-center gap-2 text-[#899087]">
                <CheckCircle2 size={15} />
                <span className="text-[10px] font-medium">
                  Priority
                </span>
              </div>

              <span
                className={`mt-2 inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${getPriorityStyle(task.priority)}`}
              >
                {task.priority}
              </span>
            </div>

            <div className="rounded-xl border border-[#edede6] bg-[#fbfaf6] p-3">
              <div className="flex items-center gap-2 text-[#899087]">
                <UserRound size={15} />
                <span className="text-[10px] font-medium">
                  Created by
                </span>
              </div>

              <p className="mt-2 truncate text-sm font-semibold text-[#35463a]">
                {task.createdBy}
              </p>
            </div>
          </div>

          {/* Status update */}
          <form onSubmit={handleSubmit}>
            <div className="rounded-2xl border border-[#dfe7dc] bg-[#f6f8f2] p-4">
              <div className="flex items-center gap-2">
                <Clock3 size={17} className="text-[#315b48]" />

                <label
                  htmlFor="update-task-status"
                  className="text-sm font-semibold text-[#315b48]"
                >
                  Update task status
                </label>
              </div>

              <p className="mt-1 text-xs text-[#7b887c]">
                Choose the current progress of this task.
              </p>

              <select
                id="update-task-status"
                value={selectedStatus}
                onChange={(event) =>
                  setSelectedStatus(event.target.value as TaskStatus)
                }
                disabled={isUpdating}
                className="mt-4 w-full rounded-xl border border-[#dce3d8] bg-white px-3.5 py-3 text-sm text-[#26382f] outline-none transition focus:border-[#668572] focus:ring-4 focus:ring-[#668572]/10 disabled:opacity-60"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Footer */}
            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={isUpdating}
                className="rounded-xl border border-[#e4e5dc] bg-white px-5 py-2.5 text-sm font-medium text-[#59655d] transition hover:bg-[#f3f3ed] disabled:opacity-50"
              >
                Close
              </button>

              <button
                type="submit"
                disabled={isUpdating || !hasStatusChanged}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#315b48] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#274a39] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUpdating ? (
                  <>
                    <LoaderCircle
                      size={16}
                      className="animate-spin"
                    />
                    Updating...
                  </>
                ) : (
                  "Save status"
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
