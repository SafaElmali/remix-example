import { useState, useEffect, FC } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertCircle, CheckCircle, Clock, Trash2 } from "lucide-react";
import { useTaskUpdate } from "../_hooks/use-task-update";
import { useTaskDelete } from "../_hooks/use-task-delete";
import { useOptimisticTask } from "../_utils/optimistic-updates";
import type { Task, TaskStatus, TaskPriority } from "../_types/task";

type TaskCardProps = {
  task: Task;
  onDelete?: (id: number) => void;
};

const TaskCard: FC<TaskCardProps> = ({ task, onDelete }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const updateFetcher = useTaskUpdate();
  const deleteFetcher = useTaskDelete();

  // Use optimistic updates for immediate UI feedback
  const { optimisticTask, updateOptimisticTask } = useOptimisticTask(task);

  // Handle status change
  const handleStatusChange = (value: string) => {
    updateOptimisticTask({ status: value as TaskStatus });

    updateFetcher.submit(
      {
        _action: "updateTask",
        id: String(task.id),
        status: value,
      },
      { method: "post" }
    );
  };

  // Handle priority change
  const handlePriorityChange = (value: string) => {
    updateOptimisticTask({ priority: value as TaskPriority });

    updateFetcher.submit(
      {
        _action: "updateTask",
        id: String(task.id),
        priority: value,
      },
      { method: "post" }
    );
  };

  // Handle delete confirmation
  const confirmDelete = () => {
    if (deleteFetcher.state !== "idle") return;

    if (onDelete) {
      onDelete(task.id);
    }

    deleteFetcher.submit(
      {
        _action: "deleteTask",
        id: String(task.id),
      },
      { method: "post" }
    );
  };

  // Show success toast when delete operation completes
  useEffect(() => {
    if (deleteFetcher.state === "idle" && deleteFetcher.data?.success) {
      toast.success("Task deleted successfully");
      setShowDeleteDialog(false);
    }
  }, [deleteFetcher.state, deleteFetcher.data]);

  // Get status icon
  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  // Get status color
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  // Get priority color
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format status text
  const formatStatus = (status: TaskStatus) => {
    switch (status) {
      case "in-progress":
        return "In Progress";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">
            {optimisticTask.title}
          </CardTitle>
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:text-red-700"
                disabled={deleteFetcher.state !== "idle"}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the task
                  "{optimisticTask.title}" and remove it from your task list.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={confirmDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {deleteFetcher.state !== "idle" ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <CardDescription className="mt-1">
          Created on{" "}
          {new Date(optimisticTask.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-2">
        {optimisticTask.description && (
          <p className="text-sm text-gray-600 mb-4">
            {optimisticTask.description}
          </p>
        )}

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-1">Status</p>
            <Select
              value={optimisticTask.status}
              onValueChange={handleStatusChange}
              disabled={updateFetcher.state !== "idle"}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Priority</p>
            <Select
              value={optimisticTask.priority}
              onValueChange={handlePriorityChange}
              disabled={updateFetcher.state !== "idle"}
            >
              <SelectTrigger className="w-full">
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

      <CardFooter className="pt-2 flex gap-2">
        <span
          className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(
            optimisticTask.status
          )}`}
        >
          {formatStatus(optimisticTask.status)}
        </span>
        <span
          className={`px-2 py-1 rounded-md text-xs font-medium ${getPriorityColor(
            optimisticTask.priority
          )}`}
        >
          {optimisticTask.priority.charAt(0).toUpperCase() +
            optimisticTask.priority.slice(1)}
        </span>
      </CardFooter>
    </Card>
  );
};

export { TaskCard };
