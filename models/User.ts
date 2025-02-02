import mongoose, { Callback, Schema, model } from "mongoose";
import bcrypt from "bcrypt";

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
	test: string;
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
		test: {
			type: String,
		},
	},
	{
		timestamps: true,
	},
);

// UserSchema.pre("save", function (next) {
// 	const user = this;
// 	if (this.isModified("password") || this.isNew) {
// 		bcrypt.genSalt(10, function (saltError, salt) {
// 			if (saltError) {
// 				return next(saltError);
// 			} else {
// 				bcrypt.hash(user.password, salt, function (hashError, hash) {
// 					if (hashError) {
// 						return next(hashError);
// 					}

// 					user.password = hash;
// 					next();
// 				});
// 			}
// 		});
// 	} else {
// 		return next();
// 	}
// });

const User = mongoose.models?.User || model<UserDocument>("User", UserSchema);
export default User;
