import { connectDB } from "../../../lib/mongodb";
import User, { type UserDocument } from "../../../models/User";
import { NextResponse } from "next/server";

interface UpdateRequestBody {
	id: string;
	records?: [];
	type?: "approve" | "reject";
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

export async function POST(req: Request) {
	try {
		const body: UpdateRequestBody = await req.json();
		const { id, records, type } = body;

		if (!id) {
			return NextResponse.json({ message: "ID is required" }, { status: 400 });
		}

		await connectDB();

		if (records) {
			const updateAndReturn = await User.findOneAndUpdate(
				{ _id: id },
				{ $set: { records: records } },
				{ returnNewDocument: true, returnDocument: "after" },
			);
			if (updateAndReturn) {
				return NextResponse.json(
					{ message: "Updating account successfully", user: updateAndReturn },
					{ status: 201 },
				);
			}
		}

		if (type === "approve") {
			const approveRecords = await User.findOneAndUpdate(
				{ _id: id },
				{ $set: { approved: true } },
				{ returnNewDocument: true, returnDocument: "after" },
			);
			if (approveRecords) {
				return NextResponse.json(
					{ message: "Account approved successfully" },
					{ status: 201 },
				);
			}
		}

		if (type === "reject") {
			const approveRecords = await User.findOneAndUpdate(
				{ _id: id },
				{ $set: { approved: false } },
				{ returnNewDocument: true, returnDocument: "after" },
			);
			if (approveRecords) {
				return NextResponse.json(
					{ message: "Account approved successfully" },
					{ status: 201 },
				);
			}
		}

		return NextResponse.json(
			{ message: "Updating account unsuccessfully" },
			{ status: 404 },
		);
	} catch (error) {
		return NextResponse.json(
			{ message: "Something went wrong...", error },
			{ status: 500 },
		);
	}
}
