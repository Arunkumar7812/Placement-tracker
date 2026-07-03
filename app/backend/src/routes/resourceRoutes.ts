import { Router } from "express";
import { getResources, createResource, updateResource, deleteResource } from "../controllers/resourceController";
import { authenticate } from "../middleware/auth";

const router = Router();
router.use(authenticate);

router.get("/", getResources);
router.post("/", createResource);
router.put("/:id", updateResource);
router.delete("/:id", deleteResource);

export default router;
