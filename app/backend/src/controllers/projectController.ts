import { Response } from "express";
import { pool } from "../config/db";
import { AuthRequest } from "../middleware/auth";

export async function getProjects(req: AuthRequest, res: Response) {
  const result = await pool.query(
    "SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC",
    [req.userId]
  );
  res.json({ projects: result.rows });
}

export async function createProject(req: AuthRequest, res: Response) {
  const { title, description, tech_stack, repo_url, live_url, status } = req.body;
  if (!title) return res.status(400).json({ message: "Title is required" });

  const result = await pool.query(
    `INSERT INTO projects (user_id, title, description, tech_stack, repo_url, live_url, status)
     VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, 'in_progress')) RETURNING *`,
    [req.userId, title, description, tech_stack, repo_url, live_url, status]
  );
  res.status(201).json({ project: result.rows[0] });
}

export async function updateProject(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const { title, description, tech_stack, repo_url, live_url, status } = req.body;

  const result = await pool.query(
    `UPDATE projects SET
      title = COALESCE($1, title),
      description = COALESCE($2, description),
      tech_stack = COALESCE($3, tech_stack),
      repo_url = COALESCE($4, repo_url),
      live_url = COALESCE($5, live_url),
      status = COALESCE($6, status)
     WHERE id = $7 AND user_id = $8 RETURNING *`,
    [title, description, tech_stack, repo_url, live_url, status, id, req.userId]
  );

  if (result.rows.length === 0) return res.status(404).json({ message: "Project not found" });
  res.json({ project: result.rows[0] });
}

export async function deleteProject(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const result = await pool.query("DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING id", [
    id,
    req.userId,
  ]);
  if (result.rows.length === 0) return res.status(404).json({ message: "Project not found" });
  res.json({ message: "Project deleted" });
}
