import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import type { CreateTaskInput } from '../Schemas/task.schema.js';
import { AuthRequest } from '../Middleware/auth.js';
import { success, error } from '../utils/helpers/responseShape.js';


export const getAllTasks = async (req: AuthRequest, res: Response) => {
  try {
    const todos = await prisma.todo.findMany({
      where:{
        userId: req.user!.id
      },
    });
    return success(res, todos);
  } catch (err) {
    return error(res, "Error fetching tasks", 500);
  }
}

export const getTaskById = async (req: AuthRequest, res: Response) => {
  try {
    const todoId = Number(req.params.id);
    if (isNaN(todoId) || todoId <= 0) {
      return error(res, "Invalid task ID", 400);
    }
    const todo = await prisma.todo.findFirst({
      where: {
        id: todoId,
        userId: req.user!.id
      }
    });
    if(!todo){
      return error(res, "Task not found", 404);
    }
    return success(res, todo);
  } catch (err) {
    return error(res, "Error fetching task", 500);
  }
}

export const createNewTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const data = req.body as CreateTaskInput;

    const task = await prisma.todo.create({
      data: {
        title: data.title,
        taskDescription: data.taskDescription,
        completed: data.completed ?? false,
        userId: req.user.id,
      }
    });
    return success(res, task, "Task created successfully", 201);
  } catch (err) {
    return error(res, "Error creating task", 500);
  }
}

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const todoId = Number(req.params.id);
    if (isNaN(todoId) || todoId <= 0) {
      return error(res, "Invalid task ID", 400);
    }
    
    const { title, taskDescription, completed } = req.body;

    const result = await prisma.todo.updateMany({
      where: {
        id: todoId,
        userId: req.user.id,
      },
      data: {
        ...(title !== undefined && { title }),
        ...(taskDescription !== undefined && { taskDescription }),
        ...(completed !== undefined && { completed }),
      },
    });

    if (result.count === 0) {
      return error(res, "Task not found", 404);
    }

    return success(res, { message: "Task updated successfully" });
  } catch (err) {
    return error(res, "Error updating task", 500);
  }
}

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const todoId = Number(req.params.id);
    if (isNaN(todoId) || todoId <= 0) {
      return error(res, "Invalid task ID", 400);
    }

    // Verify task belongs to user before deleting (authorization check)
    const taskExists = await prisma.todo.findFirst({
      where: {
        id: todoId,
        userId: req.user.id
      }
    });

    if (!taskExists) {
      return error(res, "Task not found", 404);
    }

    const result = await prisma.todo.delete({
      where: {
        id: todoId
      }
    });

    return success(res, {}, "Task deleted successfully", 200);
  } catch (err) {
    return error(res, "Error deleting task", 500);
  }
}

