import mongoose, { Date, Schema, model } from "mongoose";

export interface UserDocument {
	email: string;
	name: string;
	password: string;
	records: [];
	isAdmin: boolean;
	approved: boolean;
	createdAt: Date;
	updatedAt: Date;
	img: string;
	isEmailVerified: boolean;
	emailVerifiedDate?: Date;
	verificationExpiresAt: Date;
}

const UserSchema = new Schema<UserDocument>(
	{
		email: {
			type: String,
			unique: true,
			required: [true, "Email is required"],
		},
		name: {
			type: String,
		},
		password: {
			type: String,
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

UserSchema.index({ verificationExpiresAt: 1 }, { expireAfterSeconds: 0 });

const User = mongoose.models?.User || model<UserDocument>("User", UserSchema);
export default User;
