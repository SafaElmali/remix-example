import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Toaster } from "sonner";
import { TasksService } from "./_services/task.service";
import { TaskList } from "./_components/task-list";
import { NewTaskDialog } from "./_components/new-task-dialog";
import {
  validateTaskCreate,
  validateTaskUpdate,
} from "./_utils/task-validators";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import type { Task } from "./_types/task";
import type { ActionResponse } from "./_types/task-action";
import { FC } from "react";

/**
 * Loader function to fetch tasks
 */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const tasks = await TasksService.getTasks();
    return json({ tasks, error: null });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return json({
      tasks: [] as Task[],
      error: error instanceof Error ? error.message : "Failed to load tasks",
    });
  }
};

/**
 * Action function to handle task operations
 */
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const action = formData.get("_action") as string;

  try {
    switch (action) {
      case "createTask": {
        // Validate task data
        const { data, errors } = validateTaskCreate(formData);

        if (errors) {
          return json<ActionResponse>(
            { error: "Validation failed" },
            { status: 400 }
          );
        }

        // Create task
        const task = await TasksService.createTask(data!);
        return json({ task });
      }

      case "updateTask": {
        const id = Number(formData.get("id"));

        // Validate task data
        const { data, errors } = validateTaskUpdate(formData);

        if (errors) {
          return json<ActionResponse>(
            { error: "Validation failed" },
            { status: 400 }
          );
        }

        // Update task
        const task = await TasksService.updateTask(id, data!);
        return json({ task });
      }

      case "deleteTask": {
        const id = Number(formData.get("id"));

        // Delete task
        const result = await TasksService.deleteTask(id);
        return json({ success: result.success });
      }

      default:
        return json<ActionResponse>(
          { error: `Invalid action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error(`Error performing ${action} action:`, error);
    return json<ActionResponse>(
      {
        error:
          error instanceof Error ? error.message : `Failed to ${action} task`,
      },
      { status: 500 }
    );
  }
};

/**
 * Tasks route component
 */
const TasksPage: FC = () => {
  const { tasks, error } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto py-8 px-4">

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Task Management</h1>
          <p className="text-gray-500 mt-2">
            Manage your tasks with real-time updates using Remix fetchers
          </p>
        </div>
        <NewTaskDialog />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <TaskList tasks={tasks || []} />
    </div>
  );
};

export default TasksPage;
