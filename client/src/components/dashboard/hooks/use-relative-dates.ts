import { useEffect, useState } from "react";
import type { RelativeDates } from "@/components/dashboard/types";
import { getDateKey } from "@/components/dashboard/lib/date-utils";

const EMPTY_RELATIVE_DATES: RelativeDates = {
  today: null,
  tomorrow: null,
};

export function useRelativeDates(): RelativeDates {
  const [relativeDates, setRelativeDates] =
    useState<RelativeDates>(EMPTY_RELATIVE_DATES);

  useEffect(() => {
    const currentDate = new Date();
    const today = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
    );
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    setRelativeDates({
      today: getDateKey(today),
      tomorrow: getDateKey(tomorrow),
    });
  }, []);

  return relativeDates;
}
