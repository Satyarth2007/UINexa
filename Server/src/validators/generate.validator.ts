import { z } from "zod";
import { contrast } from "../services/generator/theme";

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Colors must be hex values like #3B82F6");

export const generateBodySchema = z
  .object({
    prompt: z.string().trim().min(10, "Describe your UI in at least 10 characters").max(2000),
    multiPage: z.boolean().optional().default(false),
    palette: z.object({ primary: hex, background: hex, foreground: hex }).optional(),
    brief: z
      .object({
        brandName: z.string().trim().max(60).optional(),
        context: z.string().trim().max(1500).optional(),
      })
      .optional(),
  })
  .refine((b) => !b.palette || contrast(b.palette.foreground, b.palette.background) >= 4.5, {
    message: "Text and background colors need more contrast (minimum 4.5:1). Pick a lighter or darker text color.",
    path: ["palette"],
  });


export const refineBodySchema = z.object({
  instruction: z.string().trim().min(3, "Describe the change in a few words").max(1000),
  page: z.string().regex(/^[a-z0-9-]{1,30}$/).optional().default("index"),
});

export const saveFilesSchema = z.object({
  files: z.record(z.string(), z.string().max(120_000)),
});

export const addPageSchema = z.object({
  title: z.string().trim().min(2, "Give the page a short name").max(30),
  description: z.string().trim().max(300).optional().default(""),
});
