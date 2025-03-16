import { useFetcher } from "@remix-run/react";
import type { Task } from "../_types/task";

/**
 * Hook for creating a task
 * @returns A fetcher for creating a task
 */
const useTaskCreate = () => {
  const fetcher = useFetcher<{ task: Task }>();
  
  return fetcher;
}

export { useTaskCreate };
