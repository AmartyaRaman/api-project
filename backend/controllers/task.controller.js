import db from '../config/database.js';
import { tasks } from '../models/task.model.js';
import { eq, and } from 'drizzle-orm';
import { createTaskSchema, updateTaskSchema } from '../validations/task.validation.js';
import logger from '../config/logger.js';

export const createTask = async (req, res, next) => {
  try {
    const validationResult = createTaskSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task input',
        errors: validationResult.error.errors,
      });
    }

    const { task, status } = validationResult.data;
    const userId = req.user.id;

    const [newTask] = await db
      .insert(tasks)
      .values({ 
        task, 
        status, 
        userId 
      })
      .returning();

    logger.info(`Task created successfully ID: ${newTask.task_id} by user: ${userId}`);

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: newTask,
    });
  } catch (error) {
    logger.error('Error creating task', error);
    next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const userTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, req.user.id));

    return res.status(200).json({
      success: true,
      tasks: userTasks,
    });
  } catch (error) {
    logger.error('Error fetching tasks', error);
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const validationResult = updateTaskSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task update input',
        errors: validationResult.error.errors,
      });
    }

    const { id } = req.params;
    const updateData = { 
        ...validationResult.data, 
        updated_at: new Date() 
    };

    const [updatedTask] = await db
      .update(tasks)
      .set(updateData)
      .where(
        and(
          eq(tasks.task_id, parseInt(id)),
          eq(tasks.userId, req.user.id)
        )
      )
      .returning();

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or unauthorized',
      });
    }

    logger.info(`Task updated successfully ID: ${updatedTask.task_id}`);

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task: updatedTask,
    });
  } catch (error) {
    logger.error('Error updating task', error);
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [deletedTask] = await db
      .delete(tasks)
      .where(
        and(
          eq(tasks.task_id, parseInt(id)),
          eq(tasks.userId, req.user.id)
        )
      )
      .returning();

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or unauthorized',
      });
    }

    logger.info(`Task deleted successfully ID: ${id}`);

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting task', error);
    next(error);
  }
};
