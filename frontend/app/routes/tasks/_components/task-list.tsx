import { FC, useEffect } from "react";
import { useOptimisticTasks } from "../_utils/optimistic-updates";
import { TaskCard } from "./task-card";
import type { Task } from "../_types/task";

type TaskListProps = {
  tasks: Task[];
};

const TaskList: FC<TaskListProps> = ({ tasks }) => {
  // Use optimistic updates for immediate UI feedback
  const { optimisticTasks, removeOptimisticTask } = useOptimisticTasks(tasks);

  // Update optimistic tasks when the actual tasks change
  useEffect(() => {
    // This will reset the optimistic tasks whenever the actual tasks change
  }, [tasks]);

  // Handle task deletion
  const handleTaskDelete = (id: number) => {
    removeOptimisticTask(id);
  };

  // If there are no tasks, show a message
  if (optimisticTasks.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">
          No tasks found. Create a new task to get started.
        </p>
      </div>
    );
  }

  // Render the list of tasks in a responsive grid
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {optimisticTasks.map((task) => (
        <TaskCard key={task.id} task={task} onDelete={handleTaskDelete} />
      ))}
    </div>
  );
};

export { TaskList };
