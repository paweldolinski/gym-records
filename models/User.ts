import mongoose, { type InferSchemaType, model, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    password: {
      type: String,
    },
    terms: {
      type: Boolean,
    },
    healthConsent: {
      type: Boolean,
    },
    termsAndHealthConsentTimestamp: {
      type: Date,
    },
    records: {
      type: [
        {
          exercise: { type: String },
          classic: { type: String },
          gear: { type: String },
        },
      ],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    approved: {
      type: Boolean,
      default: false,
    },

    img: {
      type: String,
    },

    isEmailVerified: {
      type: Boolean,
    },

    emailVerifiedDate: {
      type: Date,
    },

    verificationExpiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export type UserDocument = InferSchemaType<typeof UserSchema>;

UserSchema.index({ verificationExpiresAt: 1 }, { expireAfterSeconds: 0 });

const User = mongoose.models?.User || model<UserDocument>("User", UserSchema);
export default User;
