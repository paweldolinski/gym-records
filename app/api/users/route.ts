import {
	handleApproval,
	handleDelete,
	handleRegister,
	handleUpdate,
} from "@/utilities/userActions";
import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import User, { type UserDocument } from "../../../models/User";

export interface UpdateRequestBody {
	id: string;
	name: string;
	password: string;
	email: string;
	records?: [];
	type?: "approve" | "reject" | "update" | "register" | "delete";
}

export async function POST(req: Request) {
	try {
		const body: UpdateRequestBody = await req.json();
		const { id, records, type } = body;

		await connectDB();

		switch (type) {
			case "register":
				return await handleRegister(body);

			case "update":
				if (!id || !records) {
					return NextResponse.json(
						{ message: "Missing ID or records for update" },
						{ status: 400 },
					);
				}
				return await handleUpdate(id, records);

			case "approve":
				if (!id)
					return NextResponse.json(
						{ message: "ID is required" },
						{ status: 400 },
					);
				return await handleApproval(id, true);

			case "reject":
				if (!id)
					return NextResponse.json(
						{ message: "ID is required" },
						{ status: 400 },
					);
				return await handleApproval(id, false);

			default:
				return NextResponse.json(
					{ message: "Invalid action type" },
					{ status: 400 },
				);
		}
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ message: "Something went wrong", error },
			{ status: 500 },
		);
	}
}

export async function GET() {
	try {
		await connectDB();

		const users: UserDocument[] = await User.find();

		return NextResponse.json(users, { status: 200 });
	} catch (err) {
		return NextResponse.json({ message: "Error", err }, { status: 500 });
	}
}

export async function DELETE(req: Request) {
	const body: UpdateRequestBody = await req.json();
	const { id } = body;
	try {
		await connectDB();
		if (!id)
			return NextResponse.json({ message: "ID is required" }, { status: 400 });
		// return await handleDeleteAll();

		return await handleDelete(id);
	} catch (error) {
		return NextResponse.json(
			{ message: "Something went wrong with delete user", error },
			{ status: 500 },
		);
	}
}
