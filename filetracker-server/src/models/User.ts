import { Schema, model, InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    email: { type: String, unique: true },
    capitalized_name: { type: String },
    name: { type: String },
    role: {
      type: String,
      enum: ["admin", "editor", "viewer"],
    },
    password: { type: String },
    device_id: { type: String },
  },
  { timestamps: true }
);

// Create an index to enforce uniqueness on the email field
userSchema.index({ email: 1 }, { unique: true });

userSchema.pre("save", function () {
  this.capitalized_name = this?.name?.toUpperCase();
});

export type SchemaType = InferSchemaType<typeof userSchema>;

const User = model<SchemaType>("User", userSchema);

export { User };
