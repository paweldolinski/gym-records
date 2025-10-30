import {
	handleApproval,
	handleDelete,
	handleRegister,
	handleUpdateProfile,
	handleUpdateRecord,
} from "@/utilities/userActions";
import { v2 as cloudinary } from "cloudinary";
import type { Document } from "mongoose";
import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import User, { type UserDocument } from "../../../models/User";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UpdateRequestBody {
	id: string;
	name: string;
	password: string;
	email: string;
	records?: [];
	type?:
		| "approve"
		| "reject"
		| "recordsUpdate"
		| "profileUpdate"
		| "register"
		| "delete"
		| "profile"
		| "imageUpdate";
	data: object;
	img: string;
}

export async function POST(req: Request) {
	try {
		const body: UpdateRequestBody = await req.json();
		const { id, records, type, data, img } = body;

		await connectDB();

		switch (type) {
			case "register":
				return await handleRegister(body);

			case "recordsUpdate":
				if (!id || !records) {
					return NextResponse.json(
						{ message: "Missing ID or records for update" },
						{ status: 400 },
					);
				}
				return await handleUpdateRecord(id, records);

			case "profileUpdate":
				if (!id || !data) {
					return NextResponse.json(
						{ message: "Missing ID or data for update" },
						{ status: 400 },
					);
				}
				return await handleUpdateProfile(id, data);

			case "imageUpdate":
				if (!id || !img) {
					return NextResponse.json(
						{ message: "Missing ID or data for update" },
						{ status: 400 },
					);
				}

				try {
					const uploadRes = await cloudinary.uploader.upload(img, {
						folder: "profile-photos",
					});

					const res = await handleUpdateProfile(id, {
						img: uploadRes.secure_url,
					});
					const body = await res.json();

					if (res.status !== 201) {
						return NextResponse.json(
							{ message: body.message },
							{ status: 400 },
						);
					}

					return NextResponse.json(
						{ url: uploadRes.secure_url },
						{ status: 200 },
					);
				} catch (error) {
					return NextResponse.json({ message: error }, { status: 400 });
				}

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

		const users = await User.find().lean<Document<UserDocument>[]>();

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
