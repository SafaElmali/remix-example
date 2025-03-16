export type TaskStatus = 'pending' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export type Task = {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  created_at: string;
  updated_at: string;
};

export type TaskCreateInput = Omit<Task, 'id' | 'created_at' | 'updated_at'>;
export type TaskUpdateInput = Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>>;

// Type for a specific field update
export type TaskFieldUpdate = {
  id: number;
  field: keyof TaskUpdateInput;
  value: string;
};
