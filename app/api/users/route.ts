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
