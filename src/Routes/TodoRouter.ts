import express from 'express'
import { Router } from 'express'
import { getAllTasks, createNewTask, updateTask, deleteTask, getTaskById } from '../Controller/taskController.js';
import { authMiddleware } from '../Middleware/auth.js';
import { validate } from '../Middleware/validate.js';
import { createTaskSchema } from '../Schemas/task.schema.js';
export const todoRouter = Router();

todoRouter.get('/get', authMiddleware, getAllTasks);
todoRouter.get('/get/:id', authMiddleware, getTaskById)
todoRouter.post('/post', authMiddleware, validate(createTaskSchema), createNewTask);
todoRouter.patch('/update/:id', authMiddleware, validate(createTaskSchema), updateTask);
todoRouter.delete('/delete/:id', authMiddleware, deleteTask);


