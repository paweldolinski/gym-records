import { log } from "console";
import NextAuth, { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

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
		// 		password: { label: "Password", type: "password" },
		// 	},
		// 	async authorize(credentials) {
		// 		if (!credentials || !credentials.email || !credentials.password)
		// 			return null;

		// 		console.log("cre", credentials);

		// 		// const dbUser = await prisma.user.findFirst({
		// 		// 	where: { email: credentials.email },
		// 		// });

		// 		//Verify Password here
		// 		//We are going to use a simple === operator
		// 		//In production DB, passwords should be encrypted using something like bcrypt...
		// 		// if (dbUser && dbUser.password === credentials.password) {
		// 		// 	const { password, createdAt, id, ...dbUserWithoutPassword } = dbUser;
		// 		// 	return dbUserWithoutPassword as User;
		// 		// }

		// 		return null;
		// 	},
		// }),
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
	],
	callbacks: {
		jwt: async ({ user, token, trigger, session }) => {
			// if (trigger === "update") {
			// 	return { ...token, ...session.user };
			// }

			console.log("jwt", { user: user, token: token, session: session });
			return { ...token, ...user };
		},
		session: async ({ session, token, user }) => {
			console.log("session", session, token, user);

			return session;
		},
	},
};
