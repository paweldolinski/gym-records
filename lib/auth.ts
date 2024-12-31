import { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "./mongodb";
import User from "../models/User";

const emptyRecords = [
	{ exercise: "squad", classic: 0, gear: 0 },
	{ exercise: "press", classic: 0, gear: 0 },
	{ exercise: "lift", classic: 0, gear: 0 },
];

export const authOptions: NextAuthConfig = {
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
	],
	callbacks: {
		signIn: async ({ user, account }) => {
			try {
				await connectDB();
				const existingUser = await User.findOne({ email: user.email });

				if (!existingUser) {
					await User.create({
						email: user.email,
						name: user.name,
						records: emptyRecords,
					});

					return true;
				}

				return true;
			} catch (err) {
				console.log("Error saving user", err);
				return false;
			}
		},
		jwt: async ({ token, account, profile, trigger, session }) => {
			const existingUser = await User.findOne({ email: token.email });

			// console.log("jwt", { account: account, token: token, profile: profile });

			return { ...token, records: existingUser.records, id: existingUser._id };
		},
		session: async ({ session, token, user }) => {
			// console.log(session, "--------------");
			return {
				...session,
				user: { ...session.user, records: token.records, id: token.id },
			};
		},
	},
};
