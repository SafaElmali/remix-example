import { useEffect, useState } from "react";
import type { Task } from "../_types/task";

/**
 * Hook for optimistically updating a single task
 * @param originalTask - The original task
 * @returns An object containing the optimistic task and a function to update it
 */
export const useOptimisticTask = (originalTask: Task) => {
  const [optimisticTask, setOptimisticTask] = useState<Task>(originalTask);

  // Reset the optimistic task when the original task changes
  useEffect(() => {
    setOptimisticTask(originalTask);
  }, [originalTask]);

  // Function to update the optimistic task
  const updateOptimisticTask = (updates: Partial<Task>) => {
    setOptimisticTask(current => ({
      ...current,
      ...updates,
    }));
  };

  return { optimisticTask, updateOptimisticTask };
}

/**
 * Hook for optimistically updating a list of tasks
 * @param originalTasks - The original list of tasks
 * @returns An object containing the optimistic tasks and functions to update them
 */
export const useOptimisticTasks = (originalTasks: Task[]) => {
  const [optimisticTasks, setOptimisticTasks] = useState<Task[]>(originalTasks);

  // Reset the optimistic tasks when the original tasks change
  useEffect(() => {
    setOptimisticTasks(originalTasks);
  }, [originalTasks]);

  // Function to update a task in the optimistic tasks list
  const updateOptimisticTask = (id: number, updates: Partial<Task>) => {
    setOptimisticTasks(current => 
      current.map(task => 
        task.id === id ? { ...task, ...updates } : task
      )
    );
  };

  // Function to add a task to the optimistic tasks list
  const addOptimisticTask = (task: Task) => {
    setOptimisticTasks(current => [...current, task]);
  };

  // Function to remove a task from the optimistic tasks list
  const removeOptimisticTask = (id: number) => {
    setOptimisticTasks(current => 
      current.filter(task => task.id !== id)
    );
  };

  return {
    optimisticTasks,
    updateOptimisticTask,
    addOptimisticTask,
    removeOptimisticTask
  };
}
