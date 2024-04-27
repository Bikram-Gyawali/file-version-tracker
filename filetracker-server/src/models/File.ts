import { Schema, model, InferSchemaType } from "mongoose";

const fileSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    metadata: {
      type: Object,
    },
    external_url: {
      type: String,
    },
    folder: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
      required: true,
    },
    tags: {
      type: [String],
    },
    description: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);


export type SchemaType = InferSchemaType<typeof fileSchema>;

const File = model<SchemaType>("File", fileSchema);

export { File };
