import { useFetcher } from "@remix-run/react";
import type { Task, TaskUpdateInput } from "../_types/task";

/**
 * Hook for updating a task
 * @returns A fetcher for updating a task
 */
const useTaskUpdate = () => {
  const fetcher = useFetcher<{ task: Task }>();
  
  return fetcher;
};

export { useTaskUpdate };
