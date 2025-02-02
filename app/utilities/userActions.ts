import { NextResponse } from "next/server";
import User, { type UserDocument } from "../../models/User";
import { createNewUser } from "./user";
import type { UpdateRequestBody } from "@/api/users/route";
import { generateVerificationToken } from "../../lib/auth";

export const handleRegister = async (body: UpdateRequestBody) => {
	const { name, email, password } = body;
	if (!name || !email || !password) {
		return NextResponse.json(
			{ message: "Missing registration fields" },
			{ status: 400 },
		);
	}

	try {
		const newUserResponse = await createNewUser({ name, email, password });
		return newUserResponse;
	} catch (error) {
		console.log(error);
	}
};

export const handleUpdate = async (id: string, records: []) => {
	const updatedUser = await User.findOneAndUpdate(
		{ _id: id },
		{ $set: { records } },
		{ returnNewDocument: true, returnDocument: "after" },
	);

	if (updatedUser) {
		return NextResponse.json(
			{ message: "Updating account successfully", user: updatedUser },
			{ status: 201 },
		);
	}

	return NextResponse.json(
		{ message: "Failed to update account" },
		{ status: 404 },
	);
};

export const handleApproval = async (id: string, approved: boolean) => {
	const updatedUser = await User.findOneAndUpdate(
		{ _id: id },
		{ $set: { approved } },
		{ returnNewDocument: true, returnDocument: "after" },
	);

	if (updatedUser) {
		return NextResponse.json(
			{
				message: approved
					? "Account approved successfully"
					: "Account rejected successfully",
			},
			{ status: 201 },
		);
	}

	return NextResponse.json(
		{ message: "Failed to update approval status" },
		{ status: 404 },
	);
};

export const handleDelete = async (id: string) => {
	try {
		const deleteUser = await User.deleteOne({ _id: id });

		if (deleteUser.acknowledged === true && deleteUser.deletedCount === 1) {
			return NextResponse.json(
				{ message: "User removed succesfully", status: 200 },
				{ status: 200 },
			);
		}
		return NextResponse.json(
			{ message: "User removed unsuccesfully" },
			{ status: 404 },
		);
	} catch (error) {
		console.log(error);
	}
};

export const handleDeleteAll = async () => {
	try {
		await User.deleteMany({});

		return NextResponse.json({ message: "wywalone" }, { status: 404 });
	} catch (error) {
		console.log(error);
	}
};
