import { Schema } from 'mongoose';

export const ImageSubSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    width: { type: Number },
    height: { type: Number },
    alt: { type: String, required: true, maxlength: 200 },
    mimeType: { type: String, required: true, maxlength: 100 },
  },
  { _id: false },
);

export const FileAssetSubSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    mimeType: { type: String, required: true, maxlength: 100 },
    width: { type: Number },
    height: { type: Number },
    alt: { type: String, required: true, maxlength: 200 },
  },
  { _id: false },
);
