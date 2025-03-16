import { json } from "@remix-run/node";
import { useLoaderData, useFetcher, MetaFunction } from "@remix-run/react";
import type { ActionFunctionArgs } from "@remix-run/node";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "./_services/task.service";
import { Task } from "./_types/task";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export const meta: MetaFunction = () => {
  return [
    { title: "Task Management" },
    {
      name: "description",
      content: "Task management example with Remix fetchers",
    },
  ];
};

// Loader function to fetch all tasks
export const loader = async () => {
  try {
    const tasks = await getTasks();
    return json({ tasks, error: null });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return json({ tasks: [], error: "Failed to load tasks" });
  }
};

// Action function to handle task operations
export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const action = formData.get("_action") as string;

  try {
    // Handle different actions
    switch (action) {
      case "create": {
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const priority = formData.get("priority") as "low" | "medium" | "high";

        const newTask = await createTask({
          title,
          description,
          priority,
          status: "pending",
        });

        return json({
          action: "create",
          task: newTask,
          error: null,
        });
      }

      case "update": {
        const taskId = parseInt(formData.get("taskId") as string);
        const field = formData.get("field") as string;
        const value = formData.get("value") as string;

        // Create an update object with just the field being updated
        const updateData: Partial<Task> = { [field]: value };

        const updatedTask = await updateTask(taskId, updateData);

        return json({
          action: "update",
          task: updatedTask,
          error: null,
        });
      }

      case "delete": {
        const taskId = parseInt(formData.get("taskId") as string);
        await deleteTask(taskId);

        return json({
          action: "delete",
          taskId,
          error: null,
        });
      }

      default:
        return json({
          error: `Unknown action: ${action}`,
        });
    }
  } catch (error) {
    console.error(`Error performing ${action}:`, error);
    return json({
      error: `Failed to ${action} task`,
    });
  }
};

// Status badge component
const StatusBadge = ({ status }: { status: Task["status"] }) => {
  const variants = {
    pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    "in-progress": "bg-blue-100 text-blue-800 hover:bg-blue-200",
    completed: "bg-green-100 text-green-800 hover:bg-green-200",
  };

  return (
    <Badge className={variants[status]} variant="outline">
      {status === "in-progress"
        ? "In Progress"
        : status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

// Priority badge component
const PriorityBadge = ({ priority }: { priority: Task["priority"] }) => {
  const variants = {
    low: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    medium: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    high: "bg-red-100 text-red-800 hover:bg-red-200",
  };

  return (
    <Badge className={variants[priority]} variant="outline">
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  );
};

// Main component
export default function TasksRoute() {
  const { tasks, error } = useLoaderData<typeof loader>();
  const [newTaskDialogOpen, setNewTaskDialogOpen] = useState(false);

  // Create a ref to store the task list element
  const taskListRef = useRef<HTMLDivElement>(null);

  // Toast notifications for actions
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Task Management</h1>
          <p className="text-gray-600 mt-1">
            Example of using Remix fetchers for CRUD operations without page
            transitions
          </p>
        </div>
        <Button onClick={() => setNewTaskDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* Task list */}
      <div
        ref={taskListRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} taskListRef={taskListRef} />
        ))}
      </div>

      {/* New Task Dialog */}
      <NewTaskDialog
        open={newTaskDialogOpen}
        onOpenChange={setNewTaskDialogOpen}
        taskListRef={taskListRef}
      />
    </div>
  );
}

// Task Card Component
function TaskCard({
  task,
  taskListRef,
}: {
  task: Task;
  taskListRef: React.RefObject<HTMLDivElement>;
}) {
  const updateFetcher = useFetcher();
  const deleteFetcher = useFetcher();

  const isUpdating = updateFetcher.state !== "idle";
  const isDeleting = deleteFetcher.state !== "idle";

  // Handle status change
  const handleStatusChange = (newStatus: Task["status"]) => {
    const formData = new FormData();
    formData.append("_action", "update");
    formData.append("taskId", task.id.toString());
    formData.append("field", "status");
    formData.append("value", newStatus);

    updateFetcher.submit(formData, { method: "post" });

    // Show toast notification
    toast.success(`Task status updated to ${newStatus}`);
  };

  // Handle priority change
  const handlePriorityChange = (newPriority: Task["priority"]) => {
    const formData = new FormData();
    formData.append("_action", "update");
    formData.append("taskId", task.id.toString());
    formData.append("field", "priority");
    formData.append("value", newPriority);

    updateFetcher.submit(formData, { method: "post" });

    // Show toast notification
    toast.success(`Task priority updated to ${newPriority}`);
  };

  // Handle delete
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      const formData = new FormData();
      formData.append("_action", "delete");
      formData.append("taskId", task.id.toString());

      deleteFetcher.submit(formData, { method: "post" });

      // Show toast notification
      toast.success("Task deleted successfully");

      // Add a fade-out animation to the card
      const taskCard = document.getElementById(`task-${task.id}`);
      if (taskCard) {
        taskCard.classList.add("opacity-50", "transition-opacity");
      }
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <Card
      id={`task-${task.id}`}
      className={`${
        isDeleting ? "opacity-50" : ""
      } transition-opacity duration-300`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <CardTitle>{task.title}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
        <CardDescription>
          Created on {formatDate(task.created_at)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 mb-4">{task.description}</p>

        <div className="space-y-4">
          {/* Status selector */}
          <div>
            <Label
              htmlFor={`status-${task.id}`}
              className="text-xs font-medium text-gray-500 mb-1 block"
            >
              Status
            </Label>
            <Select
              defaultValue={task.status}
              onValueChange={handleStatusChange}
              disabled={isUpdating}
            >
              <SelectTrigger id={`status-${task.id}`} className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority selector */}
          <div>
            <Label
              htmlFor={`priority-${task.id}`}
              className="text-xs font-medium text-gray-500 mb-1 block"
            >
              Priority
            </Label>
            <Select
              defaultValue={task.priority}
              onValueChange={handlePriorityChange}
              disabled={isUpdating}
            >
              <SelectTrigger id={`priority-${task.id}`} className="w-full">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="flex space-x-2">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>
        {isUpdating && (
          <div className="text-xs text-blue-600 animate-pulse">Updating...</div>
        )}
      </CardFooter>
    </Card>
  );
}

// New Task Dialog Component
function NewTaskDialog({
  open,
  onOpenChange,
  taskListRef,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskListRef: React.RefObject<HTMLDivElement>;
}) {
  const createFetcher = useFetcher<typeof action>();
  const isSubmitting = createFetcher.state !== "idle";
  const formRef = useRef<HTMLFormElement>(null);

  // Reset form and close dialog when task is created
  useEffect(() => {
    if (createFetcher.data?.action === "create" && !isSubmitting) {
      // Reset form
      formRef.current?.reset();

      // Close dialog
      onOpenChange(false);

      // Show toast notification
      toast.success("Task created successfully");

      // Scroll to the task list
      if (taskListRef.current) {
        taskListRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [createFetcher.data, isSubmitting, onOpenChange, taskListRef]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task to your list. Press save when you're done.
          </DialogDescription>
        </DialogHeader>

        <createFetcher.Form
          ref={formRef}
          method="post"
          className="space-y-4 mt-4"
        >
          <input type="hidden" name="_action" value="create" />

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" placeholder="Task title" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Task description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select name="priority" defaultValue="medium">
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {createFetcher.data?.error && (
            <div className="bg-red-100 p-3 rounded-md flex items-center text-red-800 text-sm">
              <AlertCircle className="h-4 w-4 mr-2" />
              {createFetcher.data.error}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </createFetcher.Form>
      </DialogContent>
    </Dialog>
  );
}
