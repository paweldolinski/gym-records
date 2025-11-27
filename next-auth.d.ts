import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      records: unknown[] | undefined;
      approved: boolean | undefined;
      id: string;
      isAdmin: boolean;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
