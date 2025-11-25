import { createNewUser } from "@/utilities/user";
import bcrypt from "bcrypt";
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
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

        if (!user) {
          throw new Error("user_not_found");
        }

        const match = await bcrypt.compare(
          credentials?.password,
          user.password,
        );

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
    signIn: async ({ user: { email, name, image }, account: { provider } }) => {
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
      const { records, id, isAdmin, approved, img } = token;

      if (session.user) {
        session.user.id = (id as string) ?? "";
        session.user.isAdmin = isAdmin as boolean | undefined;
        session.user.approved = approved as boolean | undefined;
        session.user.records = records as unknown[] | undefined;
        session.user.image =
          (img as string | null) ?? session.user.image ?? null;
      }

      return session;
    },
  },
};
