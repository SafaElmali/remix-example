import type { Task } from "./task";

export type TaskAction = 
  | { type: 'create'; payload: Task }
  | { type: 'update'; payload: Task }
  | { type: 'delete'; payload: { id: number } };

export type ActionResponse = 
  | { action: 'create'; task: Task; error: null }
  | { action: 'update'; task: Task; error: null }
  | { action: 'delete'; taskId: number; error: null }
  | { error: string };
