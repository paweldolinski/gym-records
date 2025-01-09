import mongoose, { Schema, model } from "mongoose";

export interface UserDocument {
	email: string;
	name: string;
	records: [];
	isAdmin: boolean;
	approved: boolean;
	createdAt: Date;
	updatedAt: Date;
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
	},
	{
		timestamps: true,
	},
);

const User = mongoose.models?.User || model<UserDocument>("User", UserSchema);
export default User;
