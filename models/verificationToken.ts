import mongoose, { Schema, model } from "mongoose";

export interface VerificationTokenDocument {
	email: string;
	id: string;
	token: string;
	verificationExpiresAt: Date;
}

const VerificationTokenSchema = new Schema<VerificationTokenDocument>(
	{
		email: {
			type: String,
			unique: true,
		},
		id: {
			type: String,
		},
		token: {
			type: String,
		},

		verificationExpiresAt: {
			type: Date,
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
