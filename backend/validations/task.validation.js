import { z } from 'zod';

export const createTaskSchema = z.object({
  task: z.string().min(2).max(255).trim(),
  status: z.enum(['incompleted', 'completed']).default('incompleted'),
});

export const updateTaskSchema = z.object({
  task: z.string().min(2).max(255).trim().optional(),
  status: z.enum(['incompleted', 'completed']).optional(),
});