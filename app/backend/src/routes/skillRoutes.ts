import { Router } from "express";
import { getSkills, createSkill, updateSkill, deleteSkill } from "../controllers/skillController";
import { authenticate } from "../middleware/auth";

const router = Router();
router.use(authenticate);

router.get("/", getSkills);
router.post("/", createSkill);
router.put("/:id", updateSkill);
router.delete("/:id", deleteSkill);

export default router;
