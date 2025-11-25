import mongoose, { type Document, Schema, model } from "mongoose";

export interface VerificationTokenDocument extends Document {
  email: string;
  id: string;
  token: string;
  verificationExpiresAt: Date;
}

const VerificationTokenSchema = new Schema<VerificationTokenDocument>(
  {
    email: {
      type: String,
      required: true,
    },
    id: {
      type: String,
    },
    token: {
      type: String,
      required: true,
    },

    verificationExpiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

VerificationTokenSchema.index(
  { verificationExpiresAt: 1 },
  { expireAfterSeconds: 0 },
);

const VerificationToken =
  mongoose.models?.VerificationToken ||
  model<VerificationTokenDocument>(
    "VerificationToken",
    VerificationTokenSchema,
  );
export default VerificationToken;
