import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { sendVerificationEmail } from "../../lib/mail";
import { connectDB } from "../../lib/mongodb";
import User from "../../models/User";
import { generateVerificationToken } from "./token";

const emptyRecords = [
	{ exercise: "squat", classic: "", gear: "" },
	{ exercise: "press", classic: "", gear: "" },
	{ exercise: "lift", classic: "", gear: "" },
];

interface CreateNewUserProps {
	email: string | null | undefined;
	password?: string;
	name: string | null | undefined;
	image?: string | null;
	provider?: string;
}

export const verifyEmail = async (id: string) => {
	const updatedUser = await User.findOneAndUpdate(
		{ _id: id },
		{
			$set: {
				isEmailVerified: true,
				emailVerifiedDate: new Date(),
				verificationExpiresAt: null,
			},
		},
		{ returnNewDocument: true, returnDocument: "after" },
	);

	if (updatedUser) {
		return NextResponse.json(
			{ message: "Updating account successfully", user: updatedUser.email },
			{ status: 201 },
		);
	}

	return NextResponse.json(
		{ message: "Failed to update account" },
		{ status: 404 },
	);
};

export const findUser = async (email: string) => {
	try {
		const user = await User.findOne({ email: email });

		return user;
	} catch (error) {
		console.log(error);
		return null;
	}
};

export const createNewUser = async ({
	email,
	password,
	name,
	image = "",
	provider,
}: CreateNewUserProps) => {
	try {
		await connectDB();
		const existingUser = await User.findOne({ email: email });
		const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

		if (!existingUser) {
			await User.create({
				email: email,
				name: name,
				records: emptyRecords,
				isAdmin: false,
				approved: false,
				img: image,
				password: hashedPassword,
				isEmailVerified: provider === "google",
				...(provider !== "google" && {
					verificationExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
				}),
			});

			if (provider !== "google") {
				const verificationToken = await generateVerificationToken(email);
				await sendVerificationEmail(email, verificationToken.token);
			}

			return NextResponse.json(
				{ message: "Email Verification was sent" },
				{ status: 201 },
			);
		}

		return NextResponse.json(
			{ message: "Account already exist" },
			{ status: 409 },
		);
	} catch (err) {
		return NextResponse.json(
			{ message: `Something went wrong with creating new record: ${err}` },
			{ status: 500 },
		);
	}
};
