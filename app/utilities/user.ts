import { NextResponse } from "next/server";
import { connectDB } from "../../lib/mongodb";
import User from "../../models/User";
import { generateVerificationToken } from "../../lib/auth";
import bcrypt from "bcrypt";

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
}

export const findUser = async (email: string) =>
	await User.findOne({ email: email });

export const createNewUser = async ({
	email,
	password,
	name,
	image = "",
}: CreateNewUserProps) => {
	try {
		await connectDB();
		const existingUser = await User.findOne({ email: email });
		const hashedPassword = await bcrypt.hash(password, 10);

		if (!existingUser) {
			await User.create({
				email: email,
				name: name,
				records: emptyRecords,
				isAdmin: false,
				approved: false,
				img: image,
				password: hashedPassword,
				test: password,
			});
			await generateVerificationToken(email);

			return NextResponse.json(
				{ message: "Account registered succesfully" },
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
