import { findUserBySlug } from "@/utilities/user";
import { NextResponse } from "next/server";
import { connectDB } from "../../../../lib/mongodb";

export async function GET(
	request: Request,
	{ params }: { params: { slug: string } },
) {
	const { slug } = params;

	try {
		await connectDB();

		const user = await findUserBySlug(slug);

		if (!user) {
			return NextResponse.json(
				{ message: "Użytkownik nie znaleziony" },
				{ status: 404 },
			);
		}

		return NextResponse.json(user, { status: 200 });
	} catch (err) {
		return NextResponse.json({ message: "Błąd", err }, { status: 500 });
	}
}
