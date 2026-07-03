import { Response } from "express";
import { pool } from "../config/db";
import { AuthRequest } from "../middleware/auth";

export async function getGoals(req: AuthRequest, res: Response) {
  const result = await pool.query(
    "SELECT * FROM weekly_goals WHERE user_id = $1 ORDER BY week_start DESC, created_at DESC",
    [req.userId]
  );
  res.json({ goals: result.rows });
}

export async function createGoal(req: AuthRequest, res: Response) {
  const { title, week_start, target_value, current_value, unit } = req.body;
  if (!title || !week_start) {
    return res.status(400).json({ message: "Title and week_start are required" });
  }

  const result = await pool.query(
    `INSERT INTO weekly_goals (user_id, title, week_start, target_value, current_value, unit)
     VALUES ($1, $2, $3, COALESCE($4, 1), COALESCE($5, 0), COALESCE($6, 'tasks')) RETURNING *`,
    [req.userId, title, week_start, target_value, current_value, unit]
  );
  res.status(201).json({ goal: result.rows[0] });
}

export async function updateGoal(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const { title, week_start, target_value, current_value, unit } = req.body;

  const result = await pool.query(
    `UPDATE weekly_goals SET
      title = COALESCE($1, title),
      week_start = COALESCE($2, week_start),
      target_value = COALESCE($3, target_value),
      current_value = COALESCE($4, current_value),
      unit = COALESCE($5, unit)
     WHERE id = $6 AND user_id = $7 RETURNING *`,
    [title, week_start, target_value, current_value, unit, id, req.userId]
  );

  if (result.rows.length === 0) return res.status(404).json({ message: "Goal not found" });
  res.json({ goal: result.rows[0] });
}

export async function deleteGoal(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const result = await pool.query(
    "DELETE FROM weekly_goals WHERE id = $1 AND user_id = $2 RETURNING id",
    [id, req.userId]
  );
  if (result.rows.length === 0) return res.status(404).json({ message: "Goal not found" });
  res.json({ message: "Goal deleted" });
}
