import { connectDB } from "../../../lib/mongodb";
import User, { type UserDocument } from "../../../models/User";

import { NextResponse } from "next/server";

export async function GET() {
	try {
		await connectDB();

		const users: UserDocument[] = await User.find();

		return NextResponse.json(users, { status: 200 });
	} catch (err) {
		return NextResponse.json({ message: "Error", err }, { status: 500 });
	}
}

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const { id, records } = body;

		await connectDB();

		const update = await User.updateOne(
			{ _id: id },
			{ $set: { records: records } },
		);

		if (update.matchedCount === 1 && update.modifiedCount === 1) {
			return NextResponse.json(
				{ message: "Updating account successfully" },
				{ status: 201 },
			);
		}

		return NextResponse.json(
			{ message: "Updating account unsuccessfully", re: body },
			{ status: 404 },
		);
	} catch (error) {
		return NextResponse.json(
			{ message: "Something went wrong...", error },
			{ status: 500 },
		);
	}
}
