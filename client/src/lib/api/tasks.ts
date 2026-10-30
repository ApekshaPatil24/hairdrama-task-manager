
"use client";

import { createClient } from "@/lib/supabase/client";

/* ---------- Shared API types ---------- */

export type TaskProfile = {
  id: string;
  fullName: string | null;
  avatarUrl: string | null;
};

export type ApiTask = {
  id: string;
  title: string;
  description: string | null;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: TaskProfile;
  assignedTo: TaskProfile | null;
};

export type TasksResponse = {
  success: boolean;
  tasks: ApiTask[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
};

export type TaskPriority = "low" | "medium" | "high";

export type TaskAssignee =
  | "self"
  | "unassigned"
  | `user:${string}`;

export type CreateTaskInput = {
  title: string;
  description: string;
  assignee: TaskAssignee;
  priority: TaskPriority;
  dueDate: string;
};

export type TaskStatus = ApiTask["status"];

type ApiErrorResponse = {
  success?: boolean;
  error?: string;
  message?: string;
  details?: Record<string, string>;
};

type CreateTaskResponse = {
  success: boolean;
  message: string;
  task: ApiTask;
};

type UpdateTaskStatusResponse = {
  success: boolean;
  message: string;
  task: ApiTask;
};

/* ---------- Shared API helpers ---------- */

export function getApiUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiUrl) {
    throw new Error("Backend API URL is missing.");
  }

  return apiUrl.replace(/\/+$/, "");
}

export async function getAuthenticatedSession() {
  const supabase = createClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.access_token || !session.user?.id) {
    throw new Error("Please sign in to continue.");
  }

  return session;
}

export async function parseApiError(
  response: Response
): Promise<string> {
  const result = (await response.json().catch(() => null)) as
    | ApiErrorResponse
    | null;

  const details = result?.details
    ? Object.values(result.details).join(" ")
    : "";

  const message = [
    result?.error,
    result?.message,
    details,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    message ||
    `Request failed with status ${response.status}.`
  );
}

/* ---------- Validation helpers ---------- */

function getCharacterLength(value: string): number {
  return [...value].length;
}

function hasInvalidControlCharacters(
  value: string,
  allowMultiline = false
): boolean {
  const checkedValue = allowMultiline
    ? value.replace(/[\r\n\t]/g, "")
    : value;

  return /[\p{Cc}\p{Cs}]/u.test(checkedValue);
}

function isValidUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

function isValidDateOnly(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (
    year < 1 ||
    year > 9999 ||
    month < 1 ||
    month > 12 ||
    day < 1
  ) {
    return false;
  }

  const isLeapYear =
    year % 4 === 0 &&
    (year % 100 !== 0 || year % 400 === 0);

  const daysInMonth = [
    31,
    isLeapYear ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  return day <= daysInMonth[month - 1];
}

function getLocalToday(): string {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* ---------- Fetch tasks ---------- */

export async function fetchTasks(
  page = 1,
  limit = 50
): Promise<TasksResponse> {
  if (!Number.isInteger(page) || page < 1) {
    throw new Error("Page must be a positive integer.");
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new Error("Limit must be between 1 and 100.");
  }

  const session = await getAuthenticatedSession();

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const response = await fetch(
    `${getApiUrl()}/api/tasks?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  const result = (await response.json()) as TasksResponse;

  if (!result.success || !Array.isArray(result.tasks)) {
    throw new Error("Invalid task API response.");
  }

  return result;
}

/* ---------- Create task ---------- */

export async function createTask(
  input: CreateTaskInput
): Promise<ApiTask> {
  // 1. Validate the incoming object.
  if (!input || typeof input !== "object") {
    throw new Error("Invalid task details.");
  }

  // 2. Validate title.
  if (typeof input.title !== "string") {
    throw new Error("Task title is required.");
  }

  const title = input.title.trim();

  if (!title) {
    throw new Error("Task title cannot be empty.");
  }

  if (getCharacterLength(title) > 200) {
    throw new Error("Task title cannot exceed 200 characters.");
  }

  if (hasInvalidControlCharacters(title)) {
    throw new Error(
      "Task title cannot contain control characters or line breaks."
    );
  }

  // 3. Validate description.
  if (typeof input.description !== "string") {
    throw new Error("Description must be a string.");
  }

  const description = input.description.trim();

  if (getCharacterLength(description) > 5000) {
    throw new Error("Description cannot exceed 5000 characters.");
  }

  if (hasInvalidControlCharacters(description, true)) {
    throw new Error(
      "Description contains invalid control characters."
    );
  }

  // 4. Validate and resolve the selected assignee.
  let selectedUserId: string | null = null;

  if (
    input.assignee === "self" ||
    input.assignee === "unassigned"
  ) {
    // Valid built-in selections.
  } else if (
    typeof input.assignee === "string" &&
    input.assignee.startsWith("user:")
  ) {
    const userId = input.assignee.slice(5);

    if (!isValidUuid(userId)) {
      throw new Error("Please select a valid registered user.");
    }

    selectedUserId = userId;
  } else {
    throw new Error("Please select a valid assignee.");
  }

  // 5. Validate priority.
  if (
    typeof input.priority !== "string" ||
    !["low", "medium", "high"].includes(input.priority)
  ) {
    throw new Error("Please select a valid priority.");
  }

  // 6. Validate due date.
  if (typeof input.dueDate !== "string") {
    throw new Error("Due date must be a valid string.");
  }

  const dueDate = input.dueDate.trim();

  if (!dueDate) {
    throw new Error("Due date is required.");
  }

  if (!isValidDateOnly(dueDate)) {
    throw new Error("Please enter a valid due date.");
  }

  if (dueDate < getLocalToday()) {
    throw new Error("Past due dates are not allowed.");
  }

  // 7. Authenticate the current user.
  const session = await getAuthenticatedSession();

  // 8. Resolve the database assignee UUID.
  const assignedTo: string | null =
    input.assignee === "self"
      ? session.user.id
      : input.assignee === "unassigned"
        ? null
        : selectedUserId;

  // 9. Construct a safe API payload.
  const payload = {
    title,
    description: description || null,
    assignedTo,
    priority: input.priority,
    dueDate,
  };

  // 10. Send the request to Flask.
  const response = await fetch(`${getApiUrl()}/api/tasks`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  // 11. Handle validation and server errors.
  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  // 12. Validate the successful API response.
  const result = (await response.json()) as CreateTaskResponse;

  if (!result.success || !result.task?.id) {
    throw new Error("The server returned an invalid task response.");
  }

  return result.task;
}

/* ---------- Update task status ---------- */

export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus
): Promise<ApiTask> {
  if (typeof taskId !== "string" || !taskId.trim()) {
    throw new Error("A valid task ID is required.");
  }

  if (
    !["pending", "in_progress", "completed"].includes(status)
  ) {
    throw new Error("Please select a valid task status.");
  }

  const session = await getAuthenticatedSession();

  const response = await fetch(
    `${getApiUrl()}/api/tasks/${encodeURIComponent(taskId)}/status`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ status }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(await parseApiError(response));
  }

  const result =
    (await response.json()) as UpdateTaskStatusResponse;

  if (
    !result.success ||
    !result.task?.id ||
    result.task.status !== status
  ) {
    throw new Error("Unable to verify the updated task status.");
  }

  return result.task;
}
