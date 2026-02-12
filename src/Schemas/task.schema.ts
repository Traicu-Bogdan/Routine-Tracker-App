import { Param } from "@prisma/client/runtime/client";
import { z } from "zod";

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").max(200),
    taskDescription: z.string().min(1),
    completed: z.boolean().optional().default(false),
    dueDate: z.coerce.date().optional(), // acceptă "2026-01-20" și îl face Date
  }),
});

export const updateTodoSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    title:z.string().min(1).optional(),
    taskDescription: z.string().min(1).optional(),
    completed: z.boolean().optional(),

  }).refine(
    (data) => Object.keys(data).length > 0,
    {message: "At least one field must be provided"}
  ),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>["body"];
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;