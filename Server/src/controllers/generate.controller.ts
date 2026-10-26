import type { Request, Response } from "express";
import { Types, isValidObjectId } from "mongoose";
import { generateBodySchema, refineBodySchema, saveFilesSchema, addPageSchema } from "../validators/generate.validator";
import { generateSite, refineSite, GenerationError, addPageToSite } from "../services/generator/generator.service";
import { Generation } from "../models/Generation";
import {htmlPaths} from "../services/generator/pages";

const getUserId = (req: Request) => (req as any).user.id as string; // ADAPT

const filesToArray = (f: Record<string, string>) =>
  Object.entries(f).map(([path, content]) => ({ path, content }));

const filesToObject = (arr: any[] = []): Record<string, string> =>
  Object.fromEntries(arr.map((f) => [f.path, f.content]));

function toResponse(doc: any) {
  return {
    id: String(doc._id),
    rootId: String(doc.rootId ?? doc._id),
    version: doc.version ?? 1,
    instruction: doc.instruction,
    prompt: doc.prompt,
    summary: doc.summary,
    files: filesToObject(doc.files),
    model: doc.model,
    createdAt: doc.createdAt,
  };
}

export async function createGeneration(req: Request, res: Response) {
  const parsed = generateBodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0].message });
  }
  const { prompt, multiPage, palette, brief } = parsed.data;
  const userId = getUserId(req);

  try {
    const result = await generateSite({ prompt, multiPage, palette, brief });
    const _id = new Types.ObjectId();
    const doc = await Generation.create({
      _id, rootId: _id, version: 1,
      userId, prompt, status: "completed",
      files: filesToArray(result.files),
      summary: result.summary, model: result.model, tokens: result.tokens,
    });
    return res.status(201).json({ ...toResponse(doc), failedPages: result.failedPages });
  } catch (e) {
    if (e instanceof GenerationError) {
      await Generation.create({ userId, prompt, status: "failed", error: e.message });
      return res.status(502).json({ message: "The AI couldn't generate a valid UI. Please try again." });
    }
    throw e;
  }
}

export async function getGeneration(req: Request, res: Response) {
  if (!isValidObjectId(req.params.id)) return res.status(404).json({ message: "Generation not found" });
  const doc = await Generation.findOne({ _id: req.params.id, userId: getUserId(req), status: "completed" }).lean();
  if (!doc) return res.status(404).json({ message: "Generation not found" });
  return res.json(toResponse(doc));
}


export async function listGenerations(req: Request, res: Response) {
  const userId = getUserId(req);

  const [docs, agg] = await Promise.all([
    Generation.find({ userId, status: "completed", parentId: { $exists: false } })
      .sort({ createdAt: -1 })
      .limit(6)
      .select("prompt summary model files createdAt")
      .lean(),
    Generation.aggregate([
      { $match: { userId: new Types.ObjectId(userId), status: "completed" } },
      { $group: { _id: null, total: { $sum: 1 }, tokens: { $sum: "$tokens" }, last: { $max: "$createdAt" } } },
    ]),
  ]);

  const stats = agg[0] ?? { total: 0, tokens: 0, last: null };

  return res.json({
    items: docs.map((d: any) => ({
      id: d._id,
      prompt: d.prompt,
      summary: d.summary,
      model: d.model,
      fileCount: Array.isArray(d.files) ? d.files.length : 0,
      createdAt: d.createdAt,
    })),
    stats: { total: stats.total, tokens: stats.tokens, lastGeneratedAt: stats.last },
  });
}


export async function listVersions(req: Request, res: Response) {
  if (!isValidObjectId(req.params.id)) return res.status(404).json({ message: "Generation not found" });
  const userId = getUserId(req);

  const src: any = await Generation.findOne({ _id: req.params.id, userId }).select("rootId").lean();
  if (!src) return res.status(404).json({ message: "Generation not found" });

  const rootId = src.rootId ?? src._id;
  const items: any[] = await Generation.find({
    userId, status: "completed", $or: [{ rootId }, { _id: rootId }],
  })
    .sort({ createdAt: 1 })
    .select("version instruction createdAt")
    .lean();

  return res.json(
    items.map((v, i) => ({
      id: String(v._id), version: v.version ?? i + 1, instruction: v.instruction, createdAt: v.createdAt,
    }))
  );
}

export async function saveFiles(req: Request, res: Response) {
  if (!isValidObjectId(req.params.id)) return res.status(404).json({ message: "Generation not found" });
  const parsed = saveFilesSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Invalid files" });

  const doc = await Generation.findOne({ _id: req.params.id, userId: getUserId(req), status: "completed" });
  if (!doc) return res.status(404).json({ message: "Generation not found" });

  const incoming = parsed.data.files;
  const existing = (doc.files as any[]).map((f) => f.path);
  const sameList =
    existing.length === Object.keys(incoming).length && existing.every((p) => Object.hasOwn(incoming, p));
  if (!sameList) return res.status(400).json({ message: "The list of files can't be changed" });

  for (const [p, c] of Object.entries(incoming)) {
    if (p.endsWith(".html") && !(/<html[\s>]/i.test(c) && /<\/html>/i.test(c))) {
      return res.status(400).json({ message: `${p} must stay a complete HTML document` });
    }
  }

  doc.set("files", filesToArray(incoming));
  await doc.save();
  return res.json({ id: doc.id, files: incoming });
}

export async function refineGeneration(req: Request, res: Response) {
  if (!isValidObjectId(req.params.id)) return res.status(404).json({ message: "Generation not found" });
  const parsed = refineBodySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.issues[0].message });

  const userId = getUserId(req);
  const src: any = await Generation.findOne({ _id: req.params.id, userId, status: "completed" });
  if (!src) return res.status(404).json({ message: "Generation not found" });

  const { instruction, page } = parsed.data;
  const current = filesToObject(src.files);
  if (!current[`/${page}.html`]) return res.status(400).json({ message: "That page doesn't exist in this site" });

  try {
    const out = await refineSite({ files: current, instruction, slug: page });
    const rootId = src.rootId ?? src._id;
    const count = await Generation.countDocuments({
      userId, status: "completed", $or: [{ rootId }, { _id: rootId }],
    });

    const doc = await Generation.create({
      userId, prompt: src.prompt, status: "completed",
      files: filesToArray(out.files),
      summary: src.summary, model: out.model, tokens: out.tokens,
      rootId, parentId: src._id, instruction, version: count + 1,
    });
    return res.status(201).json(toResponse(doc));
  } catch (e) {
    if (e instanceof GenerationError) {
      return res.status(502).json({ message: "The AI couldn't apply that change. Try rephrasing it." });
    }
    throw e;
  }
}

export async function createPage(req: Request, res: Response) {
  if (!isValidObjectId(req.params.id)) return res.status(404).json({ message: "Generation not found" });
  const parsed = addPageSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: parsed.error.issues[0].message });

  const title = parsed.data.title.replace(/[<>"&]/g, "").trim();
  if (title.length < 2) return res.status(400).json({ message: "Give the page a short name" });

  const userId = getUserId(req);
  const src: any = await Generation.findOne({ _id: req.params.id, userId, status: "completed" });
  if (!src) return res.status(404).json({ message: "Generation not found" });

  const current = filesToObject(src.files);
  if (!current["/index.html"] || !current["/styles.css"]) {
    return res.status(400).json({ message: "This older site can't get new pages. Generate it again, then add pages." });
  }
  if (htmlPaths(current).length >= 8) {
    return res.status(400).json({ message: "A site can have at most 8 pages" });
  }

  try {
    const out = await addPageToSite({
      files: current, userPrompt: src.prompt, title, description: parsed.data.description,
    });
    const rootId = src.rootId ?? src._id;
    const count = await Generation.countDocuments({
      userId, status: "completed", $or: [{ rootId }, { _id: rootId }],
    });

    const doc = await Generation.create({
      userId, prompt: src.prompt, status: "completed",
      files: filesToArray(out.files),
      summary: src.summary, model: out.model, tokens: out.tokens,
      rootId, parentId: src._id, instruction: `Added page: ${title}`, version: count + 1,
    });
    return res.status(201).json({ ...toResponse(doc), newPage: `/${out.slug}.html` });
  } catch (e) {
    if (e instanceof GenerationError) {
      return res.status(502).json({ message: "The AI couldn't add that page. Please try again." });
    }
    throw e;
  }
}