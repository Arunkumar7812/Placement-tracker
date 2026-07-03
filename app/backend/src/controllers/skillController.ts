import { Response } from "express";
import { pool } from "../config/db";
import { AuthRequest } from "../middleware/auth";

export async function getSkills(req: AuthRequest, res: Response) {
  const result = await pool.query(
    "SELECT * FROM skills WHERE user_id = $1 ORDER BY category, name",
    [req.userId]
  );
  res.json({ skills: result.rows });
}

export async function createSkill(req: AuthRequest, res: Response) {
  const { name, category, level } = req.body;
  if (!name) return res.status(400).json({ message: "Skill name is required" });

  try {
    const result = await pool.query(
      `INSERT INTO skills (user_id, name, category, level)
       VALUES ($1, $2, COALESCE($3, 'General'), COALESCE($4, 0)) RETURNING *`,
      [req.userId, name, category, level]
    );
    res.status(201).json({ skill: result.rows[0] });
  } catch (err: any) {
    if (err.code === "23505") {
      return res.status(409).json({ message: "You already have a skill with this name" });
    }
    throw err;
  }
}

export async function updateSkill(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const { name, category, level } = req.body;

  const result = await pool.query(
    `UPDATE skills SET
      name = COALESCE($1, name),
      category = COALESCE($2, category),
      level = COALESCE($3, level)
     WHERE id = $4 AND user_id = $5 RETURNING *`,
    [name, category, level, id, req.userId]
  );

  if (result.rows.length === 0) return res.status(404).json({ message: "Skill not found" });
  res.json({ skill: result.rows[0] });
}

export async function deleteSkill(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const result = await pool.query("DELETE FROM skills WHERE id = $1 AND user_id = $2 RETURNING id", [
    id,
    req.userId,
  ]);
  if (result.rows.length === 0) return res.status(404).json({ message: "Skill not found" });
  res.json({ message: "Skill deleted" });
}
