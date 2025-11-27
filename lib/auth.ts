import bcrypt from "bcrypt";
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { createNewUser } from "@/utilities/user";
import User from "../models/User";
import { connectDB } from "./mongodb";

export const authOptions: AuthOptions = {
  pages: {
    error: "/error",
    signIn: "/login",
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
        console.log("authorize");
        await connectDB();
        const user = await User.findOne({
          email: credentials?.email,
        }).exec();

        console.log(user, "user=========");

        if (!user || !credentials) {
          throw new Error("user_not_found");
        }

        const match = await bcrypt.compare(credentials.password, user.password);

        if (!match) throw new Error("wrong_password");

        if (!user.isEmailVerified) throw new Error("user_not_verified");

        return user;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    signIn: async ({ user: { email, name, image }, account }) => {
      const provider = account?.provider;

      if (!email || !name || provider) return false;

      try {
        await createNewUser({ email, name, image, provider });

        console.log("callbacks", image);

        return true;
      } catch (err) {
        console.log("Error saving user", err);
        return false;
      }
    },
    jwt: async ({ token }) => {
      console.log("jwt");

      const {
        records = [],
        _id,
        isAdmin,
        approved,
        img,
      } = await User.findOne({
        email: token.email,
      });

      return {
        ...token,
        records: records,
        id: _id,
        isAdmin: isAdmin,
        approved: approved,
        img,
      };
    },
    session: async ({ session, token }) => {
      const { records, id, isAdmin, approved, img } = token as {
        records?: unknown[];
        id?: string;
        isAdmin?: boolean;
        approved?: boolean;
        img?: string | null;
      };

      if (session.user) {
        session.user.id = id ?? "";
        session.user.isAdmin = isAdmin ?? false;
        session.user.approved = approved ?? false;
        session.user.records = records;
        session.user.image =
          (img as string | null) ?? session.user.image ?? null;
      }

      return session;
    },
  },
};
