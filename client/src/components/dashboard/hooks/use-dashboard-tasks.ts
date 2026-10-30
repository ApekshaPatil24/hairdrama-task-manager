
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { verifyBackendAuth } from "@/lib/api/auth";
import { fetchTasks } from "@/lib/api/tasks";
import type { DashboardTask } from "@/components/dashboard/types";
import { mapApiTask } from "@/components/dashboard/lib/map-api-task";

type UseDashboardTasksResult = {
  tasks: DashboardTask[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function useDashboardTasks(): UseDashboardTasksResult {
  const [tasks, setTasks] = useState<DashboardTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Prevent older requests from overwriting newer results.
  const requestId = useRef(0);

  const refresh = useCallback(async () => {
    const currentRequest = ++requestId.current;

    setLoading(true);
    setError(null);

    try {
      // Verify the authenticated user through Flask.
      const user = await verifyBackendAuth();

      if (currentRequest !== requestId.current) return;

      // Fetch actual task records.
      const result = await fetchTasks();

      if (currentRequest !== requestId.current) return;

      const formattedTasks = result.tasks.map((task) =>
        mapApiTask(task, user.id)
      );

      setTasks(formattedTasks);
    } catch (cause) {
      if (currentRequest !== requestId.current) return;

      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to load your tasks."
      );
    } finally {
      if (currentRequest === requestId.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void refresh();

    return () => {
      // Ignore outstanding requests when the component unmounts.
      requestId.current += 1;
    };
  }, [refresh]);

  return {
    tasks,
    loading,
    error,
    refresh,
  };
}
