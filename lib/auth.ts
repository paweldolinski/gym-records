import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "./mongodb";
import User from "../models/User";
import type { AuthOptions } from "next-auth";
import { createNewUser } from "@/utilities/user";
import { v4 as uuid4 } from "uuid";
import VerificationToken from "../models/verificationToken";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
	pages: {
		error: "/error",
	},
	session: {
		strategy: "jwt",
	},
	providers: [
		CredentialsProvider({
			name: "Login",
			credentials: {
				email: {
					label: "Email",
					type: "email",
					placeholder: "example@example.com",
					required: true,
				},
				password: {
					label: "Hasło",
					type: "password",
					placeholder: "password",
				},
			},
			async authorize(credentials) {
				await connectDB();
				const user = await User.findOne({
					email: credentials?.email,
				}).exec();

				if (!user) {
					throw new Error("user_not_found");
				}

				const match = await bcrypt.compare(
					credentials?.password,
					user.password,
				);

				console.log(await match, "match", credentials?.password, user.password);

				if (match) return user;
			},
		}),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
	],
	callbacks: {
		signIn: async ({ user: { email, name, image } }) => {
			console.log(1);
			try {
				await createNewUser({ email, name, image });

				return true;
			} catch (err) {
				console.log("Error saving user", err);
				return false;
			}
		},
		jwt: async ({ token }) => {
			console.log(2);
			const user = await User.findOne({
				email: token.email,
			});
			console.log(user, "123123");
			const {
				records = [],
				_id,
				isAdmin,
				approved,
			} = await User.findOne({
				email: token.email,
			});
			console.log(records, "records jwt");

			return {
				...token,
				records: records,
				id: _id,
				isAdmin: isAdmin,
				approved: approved,
			};
		},
		session: async ({ session, token }) => {
			console.log(3);
			const { records, id, isAdmin, approved } = token;
			console.log(records, "records token");
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

const getVerificationTokenByEmail = async (email: string) => {
	try {
		const veryficationToken = await VerificationToken.find({ email: email });
		console.log(veryficationToken);
	} catch (error) {
		console.log(error);
	}
};

export const generateVerificationToken = async (email: string) => {
	const token = uuid4();
	const expires = new Date().getTime() + 1000 * 60 * 60 * 1;

	const existingToken = await getVerificationTokenByEmail(email);

	console.log(existingToken, "existimgtoken");

	if (existingToken) {
		await VerificationToken.findOneAndUpdate(
			{ _id: existingToken.id },
			{ $unset: { token: "" } },
		);
	}

	const veryficationToken = await VerificationToken.create({
		email,
		token,
		expires: new Date(expires),
	});

	return veryficationToken;
};
