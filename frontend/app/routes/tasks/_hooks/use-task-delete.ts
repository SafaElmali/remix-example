import { useFetcher } from "@remix-run/react";
import type { Task } from "../_types/task";

/**
 * Hook for deleting a task
 * @returns A fetcher for deleting a task
 */
const useTaskDelete = () => {
  const fetcher = useFetcher<{ success: boolean }>();
  
  return fetcher;
};

export { useTaskDelete };
