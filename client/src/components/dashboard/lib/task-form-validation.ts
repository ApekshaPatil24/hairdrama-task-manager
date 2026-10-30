
import type { CreateTaskInput } from "@/lib/api/tasks";

export type TaskFormField = keyof CreateTaskInput;

export type TaskFormErrors = Partial<
  Record<TaskFormField, string>
>;

const VALID_ASSIGNEES = ["self", "unassigned"] as const;
const VALID_PRIORITIES = ["low", "medium", "high"] as const;

export function getTodayDateString(): string {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function isValidCalendarDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (year < 1 || month < 1 || month > 12 || day < 1) {
    return false;
  }

  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function validateTaskForm(
  raw: Record<string, unknown>
): {
  values: CreateTaskInput | null;
  errors: TaskFormErrors;
} {
  const errors: TaskFormErrors = {};

  // Title
  const title =
    typeof raw.title === "string" ? raw.title.trim() : "";

  if (!title) {
    errors.title = "Task title is required.";
  } else if ([...title].length > 200) {
    errors.title = "Title cannot exceed 200 characters.";
  } else if (/[\p{Cc}\p{Cs}]/u.test(title)) {
    errors.title = "Title cannot contain control characters or line breaks.";
  }

  // Description (optional)
  const description =
    typeof raw.description === "string"
      ? raw.description.trim()
      : "";

  if (typeof raw.description !== "string") {
    errors.description = "Description must be a valid string.";
  } else if ([...description].length > 5000) {
    errors.description = "Description cannot exceed 5,000 characters.";
  } else if (
    /[\p{Cc}\p{Cs}]/u.test(
      description.replace(/[\r\n\t]/g, "")
    )
  ) {
    errors.description = "Description contains invalid characters.";
  }

  // Assignee validation
const assignee = raw.assignee;

const isBuiltInAssignee =
  assignee === "self" || assignee === "unassigned";

const isRegisteredUserAssignee =
  typeof assignee === "string" &&
  assignee.startsWith("user:") &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    assignee.slice(5)
  );

if (!isBuiltInAssignee && !isRegisteredUserAssignee) {
  errors.assignee = "Please select a valid assignee.";
}

// Priority (required)
  const priority = raw.priority;

  if (
    typeof priority !== "string" ||
    !VALID_PRIORITIES.includes(
      priority as (typeof VALID_PRIORITIES)[number]
    )
  ) {
    errors.priority = "Please select a task priority.";
  }

  // Due date (required, today or future)
  const dueDate =
    typeof raw.dueDate === "string" ? raw.dueDate.trim() : "";

  if (!dueDate) {
    errors.dueDate = "Please select a due date.";
  } else if (!isValidCalendarDate(dueDate)) {
    errors.dueDate = "Please enter a valid calendar date.";
  } else if (dueDate < getTodayDateString()) {
    errors.dueDate = "Past dates are not allowed.";
  }

  if (Object.keys(errors).length > 0) {
    return { values: null, errors };
  }

  return {
    values: {
      title,
      description,
      assignee: assignee as CreateTaskInput["assignee"],
      priority: priority as CreateTaskInput["priority"],
      dueDate,
    },
    errors: {},
  };
}

export function validateTaskField(
  field: TaskFormField,
  value: string
): string | undefined {
  const defaults: Record<string, unknown> = {
    title: "Valid task",
    description: "",
    assignee: "unassigned",
    priority: "medium",
    dueDate: getTodayDateString(),
  };

  const result = validateTaskForm({
    ...defaults,
    [field]: value,
  });

  return result.errors[field];
}
