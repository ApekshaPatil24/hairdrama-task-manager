import type { ApiTask } from "@/lib/api/tasks";
import type { DashboardTask, TaskPriority, TaskStatus } from "@/components/dashboard/types";
import { getInitials } from "@/components/dashboard/lib/date-utils";

const statusLabels: Record<ApiTask["status"], TaskStatus> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
};

const priorityLabels: Record<ApiTask["priority"], TaskPriority> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export function mapApiTask(apiTask: ApiTask, currentUserId: string): DashboardTask {
  const assignedProfile = apiTask.assignedTo;
  const createdProfile = apiTask.createdBy;

  const assignee =
    assignedProfile?.id === currentUserId
      ? "You"
      : assignedProfile?.fullName?.trim() || "Unassigned";

  const createdBy =
    createdProfile?.id === currentUserId
      ? "You"
      : createdProfile?.fullName?.trim() || "Unknown";

  return {
    id: apiTask.id,
    title: apiTask.title,
    assignee,
    initials:
      assignee === "You"
        ? "ME"
        : assignee === "Unassigned"
          ? "NA"
          : getInitials(assignee),
    createdBy,
    status: statusLabels[apiTask.status],
    priority: priorityLabels[apiTask.priority],
    dueDate: apiTask.dueDate,
  };
}
