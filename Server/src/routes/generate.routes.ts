import { Router } from "express";
import { authenticate } from "../middleware/authenticate"; // ADAPT
import { generateLimiter, refineLimiter } from "../middleware/generateLimiter";
import {
  createGeneration, getGeneration, listGenerations,
  listVersions, saveFiles, refineGeneration,
  createPage,
} from "../controllers/generate.controller";

const router = Router();
router.post("/generate", authenticate, generateLimiter, createGeneration);
router.get("/generations", authenticate, listGenerations);
router.get("/generations/:id", authenticate, getGeneration);
router.get("/generations/:id/versions", authenticate, listVersions);
router.patch("/generations/:id/files", authenticate, saveFiles);
router.post("/generations/:id/refine", authenticate, refineLimiter, refineGeneration);
router.post("/generations/:id/pages", authenticate, refineLimiter, createPage);
export default router;