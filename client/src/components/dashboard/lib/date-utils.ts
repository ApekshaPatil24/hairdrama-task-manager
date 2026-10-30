import type { RelativeDates } from "@/components/dashboard/types";

export function getDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getDateLabel(
  dateString: string | null,
  relativeDates: RelativeDates,
): string {
  if (!dateString) return "No deadline";
  if (dateString === relativeDates.today) return "Today";
  if (dateString === relativeDates.tomorrow) return "Tomorrow";

  // Parse YYYY-MM-DD as a local calendar date to avoid timezone shifts.
  const [year, month, day] = dateString.slice(0, 10).split("-").map(Number);
  const selected = new Date(year, month - 1, day);

  if (Number.isNaN(selected.getTime())) return "Invalid date";

  return selected.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export function getInitials(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "U"
  );
}
