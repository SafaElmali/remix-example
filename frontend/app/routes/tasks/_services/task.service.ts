import { Task } from "../_types/task";

/**
 * Fetches all tasks from the API
 * @returns Promise with an array of tasks
 */
export const getTasks = async (): Promise<Task[]> => {
  // For demo purposes, we'll simulate an API response
  // In a real application, this would be:
  // const response = await axios.get(`${API_BASE_URL}/tasks`);
  // return response.data;
  
  // Simulated delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return MOCK_TASKS;
};

/**
 * Creates a new task
 * @param taskData - The task data to create
 * @returns Promise with the created task
 */
export const createTask = async (taskData: Partial<Task>): Promise<Task> => {
  // For demo purposes, we'll simulate an API response
  // In a real application, this would be:
  // const response = await axios.post(`${API_BASE_URL}/tasks`, { task: taskData });
  // return response.data;
  
  // Simulated delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newTask: Task = {
    id: Math.max(0, ...MOCK_TASKS.map(t => t.id)) + 1,
    title: taskData.title || "",
    description: taskData.description || "",
    status: taskData.status || "pending",
    priority: taskData.priority || "medium",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  // Add to our mock data
  MOCK_TASKS.push(newTask);
  
  return newTask;
};

/**
 * Updates a task
 * @param id - The ID of the task to update
 * @param taskData - The updated task data
 * @returns Promise with the updated task
 */
export const updateTask = async (id: number, taskData: Partial<Task>): Promise<Task> => {
  // For demo purposes, we'll simulate an API response
  // In a real application, this would be:
  // const response = await axios.put(`${API_BASE_URL}/tasks/${id}`, { task: taskData });
  // return response.data;
  
  // Simulated delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const taskIndex = MOCK_TASKS.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    throw new Error(`Task with ID ${id} not found`);
  }
  
  // Update the task
  const updatedTask: Task = {
    ...MOCK_TASKS[taskIndex],
    ...taskData,
    updated_at: new Date().toISOString()
  };
  
  // Replace in our mock data
  MOCK_TASKS[taskIndex] = updatedTask;
  
  return updatedTask;
};

/**
 * Deletes a task
 * @param id - The ID of the task to delete
 * @returns Promise with success status
 */
export const deleteTask = async (id: number): Promise<{ success: boolean }> => {
  // For demo purposes, we'll simulate an API response
  // In a real application, this would be:
  // const response = await axios.delete(`${API_BASE_URL}/tasks/${id}`);
  // return response.data;
  
  // Simulated delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const taskIndex = MOCK_TASKS.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    throw new Error(`Task with ID ${id} not found`);
  }
  
  // Remove from our mock data
  MOCK_TASKS.splice(taskIndex, 1);
  
  return { success: true };
};

// Mock data for demonstration purposes
const MOCK_TASKS: Task[] = [
  {
    id: 1,
    title: "Implement user authentication",
    description: "Add login and registration functionality to the application",
    status: "completed",
    priority: "high",
    created_at: "2025-03-10T10:00:00Z",
    updated_at: "2025-03-12T15:30:00Z"
  },
  {
    id: 2,
    title: "Design dashboard layout",
    description: "Create wireframes and mockups for the main dashboard",
    status: "in-progress",
    priority: "medium",
    created_at: "2025-03-11T09:15:00Z",
    updated_at: "2025-03-14T11:45:00Z"
  },
  {
    id: 3,
    title: "Optimize database queries",
    description: "Improve performance of slow database operations",
    status: "pending",
    priority: "high",
    created_at: "2025-03-13T14:20:00Z",
    updated_at: "2025-03-13T14:20:00Z"
  },
  {
    id: 4,
    title: "Write documentation",
    description: "Document API endpoints and usage instructions",
    status: "pending",
    priority: "low",
    created_at: "2025-03-14T16:30:00Z",
    updated_at: "2025-03-14T16:30:00Z"
  },
  {
    id: 5,
    title: "Fix responsive layout issues",
    description: "Address UI problems on mobile devices",
    status: "in-progress",
    priority: "medium",
    created_at: "2025-03-15T08:45:00Z",
    updated_at: "2025-03-15T13:10:00Z"
  }
];
