import { Schema, model } from "mongoose";

const fileSchema = new Schema(
  { path: { type: String, required: true }, content: { type: String, required: true } },
  { _id: false }
);

const generationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    prompt: { type: String, required: true },
    files: { type: [fileSchema], default: [] },
    summary: { type: String, default: "" },
    status: { type: String, enum: ["completed", "failed"], required: true },
    error: { type: String },
    model: { type: String },
    tokens: { type: Number, default: 0 },
    // versioning
    rootId: { type: Schema.Types.ObjectId, index: true },
    parentId: { type: Schema.Types.ObjectId },
    instruction: { type: String },
    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

generationSchema.index({ userId: 1, createdAt: -1 });

export const Generation = model("Generation", generationSchema);