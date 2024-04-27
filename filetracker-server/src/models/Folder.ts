import { Schema, model, InferSchemaType } from "mongoose";

const folderSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: false,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


export type SchemaType = InferSchemaType<typeof folderSchema>;

const Folder = model<SchemaType>("Folder", folderSchema);

export { Folder };
