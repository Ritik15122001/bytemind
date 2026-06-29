import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  isActive: boolean;
  blogCount: number;
  createdAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    color: { type: String, default: "#7c3aed" },
    icon: { type: String, default: "🤖" },
    isActive: { type: Boolean, default: true },
    blogCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<ICategory>("Category", CategorySchema);
