import type { ApiTask } from "@/lib/api/tasks";
import type { DashboardView } from "@/components/dashboard/layout/1. dashboard-sidebar";

export type TaskStatus = "Pending" | "In Progress" | "Completed";
export type TaskPriority = "Low" | "Medium" | "High";

export type DashboardTask = {
  id: string;
  title: string;
  assignee: string;
  initials: string;
  createdBy: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
};

export type RelativeDates = {
  today: string | null;
  tomorrow: string | null;
};

export type DashboardOverviewProps = {
  userName: string;
  userEmail: string;
};

export type TaskFilterView = Exclude<DashboardView, "Overview">;

export type DashboardApiStatus = ApiTask["status"];
export type DashboardApiPriority = ApiTask["priority"];
