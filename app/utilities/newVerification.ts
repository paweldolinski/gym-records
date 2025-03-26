"use server";

import { deleteVerificationToken, getVerificationTokenByToken } from "./token";
import { findUser, verifyEmail } from "./user";

export const newVerification = async (token: string) => {
	const existingToken = await getVerificationTokenByToken(token);

	if (!existingToken) {
		return { error: "Invalid token" };
	}

	const hasExpired = new Date(existingToken.expires) < new Date();

	if (hasExpired) {
		return { error: "Token has expired" };
	}

	const existingUser = await findUser(existingToken[0]?.email);

	if (!existingUser) {
		return { error: "User not found" };
	}

	await verifyEmail(existingUser._id);

	await deleteVerificationToken(existingToken[0].email);

	return { success: "Email verified" };
};
