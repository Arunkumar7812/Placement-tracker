import { Response } from "express";
import { pool } from "../config/db";
import { AuthRequest } from "../middleware/auth";

export async function getResources(req: AuthRequest, res: Response) {
  const result = await pool.query(
    "SELECT * FROM resources WHERE user_id = $1 ORDER BY created_at DESC",
    [req.userId]
  );
  res.json({ resources: result.rows });
}

export async function createResource(req: AuthRequest, res: Response) {
  const { title, category, url, notes, status } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });

  const result = await pool.query(
    `INSERT INTO resources (user_id, title, category, url, notes, status)
     VALUES ($1, $2, COALESCE($3, 'General'), $4, $5, COALESCE($6, 'to_study')) RETURNING *`,
    [req.userId, title, category, url, notes, status]
  );
  res.status(201).json({ resource: result.rows[0] });
}

export async function updateResource(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const { title, category, url, notes, status } = req.body;

  const result = await pool.query(
    `UPDATE resources SET
      title = COALESCE($1, title),
      category = COALESCE($2, category),
      url = COALESCE($3, url),
      notes = COALESCE($4, notes),
      status = COALESCE($5, status)
     WHERE id = $6 AND user_id = $7 RETURNING *`,
    [title, category, url, notes, status, id, req.userId]
  );

  if (result.rows.length === 0) return res.status(404).json({ message: "Resource not found" });
  res.json({ resource: result.rows[0] });
}

export async function deleteResource(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const result = await pool.query("DELETE FROM resources WHERE id = $1 AND user_id = $2 RETURNING id", [
    id,
    req.userId,
  ]);
  if (result.rows.length === 0) return res.status(404).json({ message: "Resource not found" });
  res.json({ message: "Resource deleted" });
}
