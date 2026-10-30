
"use client";

import {
  useState,
  useRef,
  useEffect,
  type ChangeEvent,
  type FocusEvent,
  type FormEvent,
} from "react";

import {
  CalendarDays,
  ChevronDown,
  ListTodo,
  LoaderCircle,
  UserRound,
  X,
} from "lucide-react";
import {
  fetchUsers,
  type DirectoryUser,
} from "@/lib/api/users";

import type { CreateTaskInput } from "@/lib/api/tasks";
import { useToast } from "@/components/ui/toast-provider";

import {
  getTodayDateString,
  validateTaskField,
  validateTaskForm,
  type TaskFormErrors,
  type TaskFormField,
} from "@/components/dashboard/lib/task-form-validation";

type CreateTaskDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: CreateTaskInput) => Promise<void>;
};

const inputClass =
  "w-full rounded-xl border border-[#e6e7df] bg-[#fffefa] px-3.5 py-3 text-sm text-[#26382f] outline-none transition placeholder:text-[#a5aaa1] focus:border-[#668572] focus:ring-4 focus:ring-[#668572]/10";

const labelClass =
  "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.09em] text-[#758077]";

const errorInputClass =
  "!border-[#c77a68] focus:!border-[#a05243] focus:!ring-[#a05243]/10";

export default function CreateTaskDialog({
  open,
  onClose,
  onSubmit,
}: CreateTaskDialogProps) {
  const { showToast } = useToast();

  const formRef = useRef<HTMLFormElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<TaskFormErrors>({});
  const [touched, setTouched] = useState<
    Partial<Record<TaskFormField, boolean>>
  >({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [assigneeValue, setAssigneeValue] = useState("");
const [assigneeLabel, setAssigneeLabel] = useState("");

const [assigneeSearch, setAssigneeSearch] = useState("");
const [assigneeMenuOpen, setAssigneeMenuOpen] = useState(false);

const [directoryUsers, setDirectoryUsers] = useState<DirectoryUser[]>([]);
const [usersLoading, setUsersLoading] = useState(false);
const [usersError, setUsersError] = useState<string | null>(null);

function handleAssigneeSelect(
  value: string,
  label: string
) {
  setAssigneeValue(value);
  setAssigneeLabel(label);
  setAssigneeMenuOpen(false);
  setAssigneeSearch("");

  setTouched((current) => ({
    ...current,
    assignee: true,
  }));

  setErrors((current) => ({
    ...current,
    assignee: validateTaskField("assignee", value) ?? "",
  }));
}

  // Close dialog and clear its validation state.
  function handleClose() {
    if (isSubmitting) return;

    formRef.current?.reset();
    setErrors({});
    setTouched({});
    setHasSubmitted(false);
    setAssigneeValue("");
setAssigneeLabel("");
setAssigneeSearch("");
setAssigneeMenuOpen(false);
setDirectoryUsers([]);

    onClose();
  }

  // Validate a field when the user leaves it.
  function handleFieldBlur(
    event: FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const field = event.currentTarget.name as TaskFormField;
    const value = event.currentTarget.value;

    setTouched((current) => ({
      ...current,
      [field]: true,
    }));

    setErrors((current) => ({
      ...current,
      [field]: validateTaskField(field, value) ?? "",
    }));
  }

  // Revalidate fields when the user edits them.
  function handleFieldChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const field = event.currentTarget.name as TaskFormField;
    const value = event.currentTarget.value;

    if (touched[field] || hasSubmitted) {
      setErrors((current) => ({
        ...current,
        [field]: validateTaskField(field, value) ?? "",
      }));
    }
  }

  function renderFieldError(
    field: TaskFormField,
    errorId: string
  ) {
    const message = errors[field];

    if (!message) return null;

    return (
      <p
        id={errorId}
        className="mt-1.5 text-xs leading-5 text-[#a05243]"
      >
        {message}
      </p>
    );
  }

  // Validate the entire form before submitting.
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const result = validateTaskForm(
      Object.fromEntries(formData.entries())
    );

    setHasSubmitted(true);

    setTouched({
      title: true,
      description: true,
      assignee: true,
      priority: true,
      dueDate: true,
    });

    setErrors(result.errors);

    // Stop submission if any field is invalid.
    if (!result.values) {
      const firstInvalidField = Object.keys(
        result.errors
      )[0] as TaskFormField | undefined;

      if (firstInvalidField) {
        form
          .querySelector<HTMLElement>(
            `[name="${firstInvalidField}"]`
          )
          ?.focus();
      }

      showToast(
        "Please correct the highlighted fields before creating the task.",
        "warning"
      );

      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(result.values);

      // Clear the form after successful creation.
      form.reset();
      setErrors({});
      setTouched({});
      setHasSubmitted(false);

      onClose();
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Unable to create the task. Please try again.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
  if (!open || !assigneeMenuOpen) return;

  let cancelled = false;

  const timeout = window.setTimeout(async () => {
    setUsersLoading(true);
    setUsersError(null);

    try {
      const result = await fetchUsers(
        assigneeSearch.trim(),
        1,
        10
      );

      if (!cancelled) {
        setDirectoryUsers(result.users);
      }
    } catch (error) {
      if (!cancelled) {
        setUsersError(
          error instanceof Error
            ? error.message
            : "Unable to load registered users."
        );
      }
    } finally {
      if (!cancelled) {
        setUsersLoading(false);
      }
    }
  }, 300);

  return () => {
    cancelled = true;
    window.clearTimeout(timeout);
  };
}, [open, assigneeMenuOpen, assigneeSearch]);

  // Keep hooks above the conditional return.
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#17251f]/45 px-4 py-5 backdrop-blur-[5px]">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-task-title"
        className="w-full max-w-[650px] overflow-hidden rounded-[24px] border border-[#e9e9df] bg-[#fffefa] shadow-[0_24px_80px_rgba(23,37,31,0.20)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#edede6] px-6 py-5 sm:px-7">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#eaf0e9] text-[#315b48]">
              <ListTodo size={21} strokeWidth={1.8} />
            </div>

            <div>
              <h2
                id="create-task-title"
                className="text-lg font-semibold tracking-tight text-[#26382f]"
              >
                Create a task
              </h2>

              <p className="mt-0.5 text-xs text-[#899087]">
                Add the details to get things moving.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Close dialog"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#7e887f] transition hover:bg-[#f0f1eb] hover:text-[#26382f] disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} noValidate>
          <div className="space-y-5 px-6 py-6 sm:px-7">

            {/* Task title */}
            <div>
              <label htmlFor="task-title" className={labelClass}>
                Task title <span className="text-[#bd775d]">*</span>
              </label>

              <input
                id="task-title"
                name="title"
                type="text"
                maxLength={200}
                required
                aria-required="true"
                aria-invalid={Boolean(errors.title)}
                aria-describedby={
                  errors.title ? "task-title-error" : undefined
                }
                placeholder="e.g. Prepare project documentation"
                autoFocus
                onBlur={handleFieldBlur}
                onChange={handleFieldChange}
                className={`${inputClass} ${
                  errors.title ? errorInputClass : ""
                }`}
              />

              {renderFieldError("title", "task-title-error")}
            </div>

            {/* Description */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label
                  htmlFor="task-description"
                  className={labelClass}
                >
                  Description
                </label>

                <span className="text-[10px] text-[#a1a69e]">
                  Optional · 5,000 characters max
                </span>
              </div>

              <textarea
                id="task-description"
                name="description"
                rows={3}
                maxLength={5000}
                aria-invalid={Boolean(errors.description)}
                aria-describedby={
                  errors.description
                    ? "task-description-error"
                    : undefined
                }
                placeholder="Add a few details about what needs to be done..."
                onBlur={handleFieldBlur}
                onChange={handleFieldChange}
                className={`${inputClass} min-h-[88px] resize-none ${
                  errors.description ? errorInputClass : ""
                }`}
              />

              {renderFieldError(
                "description",
                "task-description-error"
              )}
            </div>

            {/* Task options */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

              {/* Assignee */}
              
<div>
  <label htmlFor="task-assignee-search" className={labelClass}>
    Assign to <span className="text-[#bd775d]">*</span>
  </label>

  <div className="relative">
    {/* The selected value is submitted with the form. */}
    <input
      type="hidden"
      name="assignee"
      value={assigneeValue}
    />

    <button
      type="button"
      id="task-assignee-search"
      disabled={isSubmitting}
      aria-expanded={assigneeMenuOpen}
      aria-haspopup="listbox"
      aria-invalid={Boolean(errors.assignee)}
      aria-describedby={
        errors.assignee ? "task-assignee-error" : undefined
      }
      onClick={() => {
        setAssigneeMenuOpen((current) => !current);
      }}
      className={`${inputClass} flex items-center justify-between gap-2 text-left ${
        errors.assignee ? errorInputClass : ""
      }`}
    >
      <span
        className={
          assigneeLabel
            ? "truncate text-[#26382f]"
            : "truncate text-[#a5aaa1]"
        }
      >
        {assigneeLabel || "Select assignee"}
      </span>

      <ChevronDown
        size={15}
        className="shrink-0 text-[#899087]"
      />
    </button>

    {/* Searchable user dropdown */}
    {assigneeMenuOpen && (
      <div className="absolute left-0 top-full z-[120] mt-2 w-full min-w-[250px] overflow-hidden rounded-xl border border-[#e6e7df] bg-white shadow-[0_12px_35px_rgba(35,54,43,0.14)]">

        {/* Search input */}
        <div className="border-b border-[#edede6] p-2.5">
          <input
            type="search"
            value={assigneeSearch}
            onChange={(event) =>
              setAssigneeSearch(event.target.value)
            }
            placeholder="Search by name or email..."
            autoComplete="off"
            aria-label="Search registered users"
            className="w-full rounded-lg border border-[#e6e7df] bg-[#fffefa] px-3 py-2.5 text-xs text-[#26382f] outline-none placeholder:text-[#a5aaa1] focus:border-[#668572] focus:ring-2 focus:ring-[#668572]/10"
          />
        </div>

        <div className="max-h-[240px] overflow-y-auto p-1.5">

          {/* Built-in assignment choices */}
          <p className="px-2.5 py-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#899087]">
            Quick selection
          </p>

          <button
            type="button"
            role="option"
            aria-selected={assigneeValue === "unassigned"}
            onClick={() =>
              handleAssigneeSelect("unassigned", "Unassigned")
            }
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left text-xs text-[#35463a] transition hover:bg-[#F3F5EF]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F0E6D6] text-[#75563B]">
              <UserRound size={15} />
            </span>

            <span className="font-medium">Unassigned</span>
          </button>

          <button
            type="button"
            role="option"
            aria-selected={assigneeValue === "self"}
            onClick={() =>
              handleAssigneeSelect("self", "Myself")
            }
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left text-xs text-[#35463a] transition hover:bg-[#F3F5EF]"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8EDE4] text-[#31553D]">
              <UserRound size={15} />
            </span>

            <span className="font-medium">Myself</span>
          </button>

          {/* Registered users */}
          <div className="mt-2 border-t border-[#edede6] pt-2">
            <p className="px-2.5 py-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#899087]">
              Registered users
            </p>

            {usersLoading && (
              <div className="flex items-center justify-center gap-2 py-5 text-xs text-[#899087]">
                <LoaderCircle
                  size={15}
                  className="animate-spin"
                />
                Searching users...
              </div>
            )}

            {!usersLoading && usersError && (
              <p className="px-3 py-4 text-center text-xs text-[#A05243]">
                {usersError}
              </p>
            )}

            {!usersLoading &&
              !usersError &&
              directoryUsers.length === 0 && (
                <p className="px-3 py-4 text-center text-xs text-[#899087]">
                  {assigneeSearch
                    ? "No matching users found."
                    : "No other registered users found yet."}
                </p>
              )}

            {!usersLoading &&
              !usersError &&
              directoryUsers.map((user) => {
                const displayName =
                  user.fullName?.trim() ||
                  user.email ||
                  "Registered user";

                return (
                  <button
                    key={user.id}
                    type="button"
                    role="option"
                    aria-selected={
                      assigneeValue === `user:${user.id}`
                    }
                    onClick={() =>
                      handleAssigneeSelect(
                        `user:${user.id}`,
                        displayName
                      )
                    }
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left transition hover:bg-[#F3F5EF]"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8D9C5] text-[10px] font-bold text-[#624B35]">
                      {displayName.charAt(0).toUpperCase()}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-semibold text-[#35463a]">
                        {displayName}
                      </span>

                      <span className="mt-0.5 block truncate text-[10px] text-[#899087]">
                        {user.email}
                      </span>
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      </div>
    )}
  </div>

  {renderFieldError("assignee", "task-assignee-error")}
</div>

              {/* Priority */}
              <div>
                <label htmlFor="task-priority" className={labelClass}>
                  Priority <span className="text-[#bd775d]">*</span>
                </label>

                <div className="relative">
                  <select
                    id="task-priority"
                    name="priority"
                    defaultValue=""
                    required
                    aria-invalid={Boolean(errors.priority)}
                    aria-describedby={
                      errors.priority
                        ? "task-priority-error"
                        : undefined
                    }
                    onBlur={handleFieldBlur}
                    onChange={handleFieldChange}
                    className={`${inputClass} appearance-none pr-9 ${
                      errors.priority ? errorInputClass : ""
                    }`}
                  >
                    <option value="" disabled>
                      Select priority
                    </option>

                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>

                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#899087]"
                  />
                </div>

                {renderFieldError(
                  "priority",
                  "task-priority-error"
                )}
              </div>

              {/* Due date */}
              <div>
                <label htmlFor="task-due-date" className={labelClass}>
                  Due date <span className="text-[#bd775d]">*</span>
                </label>

                <div className="relative">
                  <input
                    id="task-due-date"
                    name="dueDate"
                    type="date"
                    required
                    min={getTodayDateString()}
                    aria-invalid={Boolean(errors.dueDate)}
                    aria-describedby={
                      errors.dueDate
                        ? "task-due-date-error"
                        : undefined
                    }
                    onBlur={handleFieldBlur}
                    onChange={handleFieldChange}
                    className={`${inputClass} pr-2 ${
                      errors.dueDate ? errorInputClass : ""
                    }`}
                  />

                  <CalendarDays
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#899087]"
                  />
                </div>

                {renderFieldError(
                  "dueDate",
                  "task-due-date-error"
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-[#edede6] bg-[#fbfaf6] px-6 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-7">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-xl border border-[#e4e5dc] bg-white px-5 py-2.5 text-sm font-medium text-[#59655d] transition hover:bg-[#f3f3ed] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#315b48] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#274a39] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle
                    size={16}
                    className="animate-spin"
                  />
                  Creating...
                </>
              ) : (
                "Create task"
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
