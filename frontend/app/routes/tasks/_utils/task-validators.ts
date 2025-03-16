import { z } from "zod";
import type { TaskCreateInput, TaskUpdateInput } from "../_types/task";

// Schema for task creation
export const taskCreateSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().optional(),
  status: z.enum(["pending", "in-progress", "completed"], {
    errorMap: () => ({ message: "Status must be one of: pending, in-progress, completed" }),
  }),
  priority: z.enum(["low", "medium", "high"], {
    errorMap: () => ({ message: "Priority must be one of: low, medium, high" }),
  }),
});

// Schema for task updates
export const taskUpdateSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters").optional(),
  description: z.string().optional(),
  status: z.enum(["pending", "in-progress", "completed"], {
    errorMap: () => ({ message: "Status must be one of: pending, in-progress, completed" }),
  }).optional(),
  priority: z.enum(["low", "medium", "high"], {
    errorMap: () => ({ message: "Priority must be one of: low, medium, high" }),
  }).optional(),
});

/**
 * Validate task creation data
 * 
 * @param formData Form data to validate
 * @returns Validation result with data or errors
 */
export const validateTaskCreate = (formData: FormData): { data?: TaskCreateInput; errors?: Record<string, string> } => {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;
  const status = formData.get("status") as string;
  const priority = formData.get("priority") as string;

  const result = taskCreateSchema.safeParse({
    title,
    description: description || undefined,
    status: status || "pending",
    priority: priority || "medium",
  });
  
  if (!result.success) {
    return { errors: formatZodErrors(result.error) };
  }
  
  return { data: result.data };
}

/**
 * Validate task update data
 * 
 * @param formData Form data to validate
 * @returns Validation result with data or errors
 */
export const validateTaskUpdate = (formData: FormData): { data?: TaskUpdateInput; errors?: Record<string, string> } => {
  const updateData: Record<string, unknown> = {};
  
  // Only include fields that are present in the form data
  const title = formData.get("title");
  if (title) updateData.title = title;
  
  const description = formData.get("description");
  if (description !== null) updateData.description = description || undefined;
  
  const status = formData.get("status");
  if (status) updateData.status = status;
  
  const priority = formData.get("priority");
  if (priority) updateData.priority = priority;
  
  const result = taskUpdateSchema.safeParse(updateData);
  
  if (!result.success) {
    return { errors: formatZodErrors(result.error) };
  }
  
  return { data: result.data };
}

/**
 * Format Zod validation errors into a simple object
 * 
 * @param error Zod validation error
 * @returns Object with field names as keys and error messages as values
 */
export const formatZodErrors = (error: z.ZodError): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join(".");
    errors[path] = err.message;
  });
  
  return errors;
}
