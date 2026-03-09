import bcrypt from "bcrypt";
import { connectDB } from "../lib/mongodb";
import User from "../models/User";

const emptyRecords = [
  { exercise: "squat", classic: "", gear: "" },
  { exercise: "press", classic: "", gear: "" },
  { exercise: "lift", classic: "", gear: "" },
];

export type CreateUserInput = {
  email: string;
  password?: string;
  name: string;
  image?: string;
  provider?: "google" | "credentials";
  terms?: boolean;
};

export async function createUserInDb({
  email,
  password,
  name,
  image = "",
  provider = "credentials",
  terms,
}: CreateUserInput) {
  await connectDB();

  const existingUser = await User.findOne({ email });
  const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
  const isGoogle = provider === "google";

  if (existingUser) {
    return { status: "exists" as const };
  }

  const user = await User.create({
    email,
    name,
    records: emptyRecords,
    terms: terms ?? !isGoogle,
    isAdmin: false,
    approved: false,
    img: image,
    password: hashedPassword,
    isEmailVerified: isGoogle,
    ...(!isGoogle && {
      verificationExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    }),
  });

  return { status: "created" as const, user };
}
