import express from 'express'
import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import type { CreateTaskInput } from '../Schemas/task.schema.js';
import { AuthRequest } from '../Middleware/auth.js';
import { id } from 'zod/locales';
import { title } from 'node:process';
import { success } from '../utils/helpers/responseShape.js';
import { todo } from 'node:test';
import { error } from 'node:console';


export const getAllTasks = async (req: AuthRequest, res: Response) => {
  const todos = await prisma.todo.findMany({
    where:{
      userId: req.user!.id
    },
  });

  if(!todos){
    return error(res);
  }
  return success(res, todos);
}

export const getTaskById = async (req: AuthRequest, res: Response) => {
  const todoId = Number(req.params.id);
  const todo = await prisma.todo.findUnique({
    where: {
      id: todoId,
      userId: req.user!.id
    }
  });
  if(!todo){
    return error(res);
  }

  return success(res, todo);
}

export const createNewTask = async (req: AuthRequest, res: Response) => {

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
  if(!task){
    return error(res);
  }
  return success(res,task);
}

export const updateTask = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const todoId = Number(req.params.id);
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
    return res.status(404).json({ message: "Todo not found" });
  }

  return res.json({ message: "Updated successfully" });
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    res.status(201).json({ message: "Unauthorized" });
  }

  const todoId = Number(req.params.id);

  const result = await prisma.todo.delete({
    where: {
      id: todoId
    }
  });

  if (!result) {
    return res.status(404).json({ message: "Item not found" });
  }

  res.status(201).json({ message: "Task deleted successfully" });
}

