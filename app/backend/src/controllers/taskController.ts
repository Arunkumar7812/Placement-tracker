import { Response } from "express";
import { pool } from "../config/db";
import { AuthRequest } from "../middleware/auth";

export async function getTasks(req: AuthRequest, res: Response) {
  const result = await pool.query(
    "SELECT * FROM tasks WHERE user_id = $1 ORDER BY due_date NULLS LAST, created_at DESC",
    [req.userId]
  );
  res.json({ tasks: result.rows });
}

export async function createTask(req: AuthRequest, res: Response) {
  const { title, description, priority, status, due_date } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });

  const result = await pool.query(
    `INSERT INTO tasks (user_id, title, description, priority, status, due_date)
     VALUES ($1, $2, $3, COALESCE($4, 'medium'), COALESCE($5, 'todo'), $6) RETURNING *`,
    [req.userId, title, description, priority, status, due_date || null]
  );
  res.status(201).json({ task: result.rows[0] });
}

export async function updateTask(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const { title, description, priority, status, due_date } = req.body;

  const result = await pool.query(
    `UPDATE tasks SET
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      priority = COALESCE($3, priority),
      status = COALESCE($4, status),
      due_date = COALESCE($5, due_date)
     WHERE id = $6 AND user_id = $7 RETURNING *`,
    [title, description, priority, status, due_date, id, req.userId]
  );

  if (result.rows.length === 0) return res.status(404).json({ message: "Task not found" });
  res.json({ task: result.rows[0] });
}

export async function deleteTask(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const result = await pool.query("DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id", [
    id,
    req.userId,
  ]);
  if (result.rows.length === 0) return res.status(404).json({ message: "Task not found" });
  res.json({ message: "Task deleted" });
}
