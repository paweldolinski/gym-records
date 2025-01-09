import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { connectDB } from "./mongodb";
import User from "../models/User";
import type { AuthOptions } from "next-auth";

const emptyRecords = [
	{ exercise: "squat", classic: 0, gear: 0 },
	{ exercise: "press", classic: 0, gear: 0 },
	{ exercise: "lift", classic: 0, gear: 0 },
];

export const authOptions: AuthOptions = {
	session: {
		strategy: "jwt",
	},
	providers: [
		// CredentialsProvider({
		// 	name: "Sign in",
		// 	credentials: {
		// 		email: {
		// 			label: "Email",
		// 			type: "email",
		// 			placeholder: "example@example.com",
		// 		},
		// 	},
		// 	async authorize(credentials) {
		// 		await connectDB();
		// 		const user = await User.findOne({
		// 			email: credentials?.email,
		// 		});

		// 		if (!user) {
		// 			console.log("no user");
		// 			const user = await User.create({
		// 				email: credentials?.email,
		// 				records: emptyRecords,
		// 			});

		// 			return user;
		// 		}

		// 		console.log(user, "user");

		// 		// const passwordMatch = await bcrypt.compare(
		// 		// 	credentials!.password,
		// 		// 	user.password,
		// 		// );
		// 		// if (!passwordMatch) throw new Error("Wrong Password");
		// 		return user;
		// 	},
		// }),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
		FacebookProvider({
			clientId: process.env.FACEBOOK_CLIENT_ID as string,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
		}),
	],
	callbacks: {
		signIn: async ({ user }) => {
			try {
				await connectDB();
				const existingUser = await User.findOne({ email: user.email });

				if (!existingUser) {
					const newUser = await User.create({
						email: user.email,
						name: user.name,
						records: emptyRecords,
						isAdmin: false,
						approved: false,
					});
					console.log(newUser, "-=-=-=-=");

					return true;
				}

				return true;
			} catch (err) {
				console.log("Error saving user", err);
				return false;
			}
		},
		jwt: async ({ token }) => {
			const { records, _id, isAdmin, approved } = await User.findOne({
				email: token.email,
			});

			// console.log("jwt", { trigger: trigger });

			return {
				...token,
				records: records,
				id: _id,
				isAdmin: isAdmin,
				approved: approved,
			};
		},
		session: async ({ session, token }) => {
			const { records, id, isAdmin, approved } = token;
			return {
				...session,
				user: {
					...session.user,
					records: records,
					id: id,
					isAdmin: isAdmin,
					approved: approved,
				},
			};
		},
	},
};
