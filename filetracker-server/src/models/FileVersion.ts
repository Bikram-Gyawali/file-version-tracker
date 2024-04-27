import { Schema, model, InferSchemaType } from "mongoose";

const fileVersion = new Schema(
  {
    activeVersionId: {
      type: Schema.Types.ObjectId,
      ref: "File",
    },
    allVersionIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "File",
      },
    ],
    folder: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

// Define the document interface
interface IFileVersion extends Document {
  activeVersionId: Schema.Types.ObjectId;
  allVersionIds: Schema.Types.ObjectId[];
  folder: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
}

export type SchemaType = InferSchemaType<typeof fileVersion>;

const FileVersion = model<SchemaType>("FileVersion", fileVersion);

export { FileVersion, IFileVersion };
