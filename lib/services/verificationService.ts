import mongoose from "mongoose";
import { connectDB } from "../mongodb";
import { deleteVerificationToken, getVerificationTokenByToken } from "../token";
import { findUser, verifyEmail } from "./userService";

export const newVerification = async (token: string) => {
  if (mongoose.connection.readyState !== 1) {
    await connectDB();
  }

  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Invalid token" };
  }

  const hasExpired = new Date(existingToken.verificationExpiresAt) < new Date();

  if (hasExpired) {
    return { error: "Token has expired" };
  }

  const existingUser = await findUser(existingToken.email);

  if (!existingUser) {
    return { error: "User not found" };
  }

  await verifyEmail(existingUser._id);
  await deleteVerificationToken(existingToken.email);

  return { success: "Email verified" };
};
