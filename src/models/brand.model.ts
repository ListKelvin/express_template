import mongoose from "mongoose";

export interface Brand extends mongoose.Document {
  brandName: string;
  createdAt: Date;
  updatedAt: Date;
}

export const brandSchema = new mongoose.Schema<Brand>(
  {
    brandName: { type: String },
  },
  {
    timestamps: true,
  }
);
const BrandModel = mongoose.model<Brand>("Brand", brandSchema);
export default BrandModel;
