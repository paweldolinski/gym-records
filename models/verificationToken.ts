import mongoose, { Schema, model } from "mongoose";

export interface VerificationTokenDocument {
	email: string;
	id: string;
	token: string;
	expires: Date;
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

		expires: {
			type: Date,
		},
	},
	{
		timestamps: true,
	},
);

const VerificationToken =
	mongoose.models?.VerificationToken ||
	model<VerificationTokenDocument>(
		"VerificationToken",
		VerificationTokenSchema,
	);
export default VerificationToken;
