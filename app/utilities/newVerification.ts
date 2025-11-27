"use server";
import mongoose from "mongoose";
import { connectDB } from "../../lib/mongodb";
import { deleteVerificationToken, getVerificationTokenByToken } from "./token";
import { findUser, verifyEmail } from "./user";

export const newVerification = async (token: string) => {
  console.log("Checking DB connection...");
  if (mongoose.connection.readyState !== 1) {
    console.log("MongoDB not connected! Trying to reconnect...");
    await connectDB();
  }

  try {
    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) {
      console.error("Token not found in database");
      return { error: "Invalid token" };
    }

    const hasExpired = new Date(existingToken[0]?.expires) < new Date();

    if (hasExpired) {
      console.error("Token has expired");
      return { error: "Token has expired" };
    }

    const existingUser = await findUser(existingToken[0]?.email);

    if (!existingUser) {
      console.error("User not found for token:", existingToken[0]?.email);
      return { error: "User not found" };
    }

    await verifyEmail(existingUser._id);

    await deleteVerificationToken(existingToken[0].email);

    return { success: "Email verified" };
  } catch (error) {
    console.error("Error in newVerification:", error);
    throw error;
  }
};
