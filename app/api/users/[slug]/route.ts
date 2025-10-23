// app/api/users/[slug]/route.ts
import { NextResponse } from "next/server";
import { findUserBySlug } from "@/utilities/user";
import { connectDB } from "../../../../lib/mongodb";

type Params = { params: { slug: string } };

export async function GET(req: Request, { params }: Params) {
	const { slug } = params;

	try {
		await connectDB();
		const user = await findUserBySlug(slug);

		if (!user) {
			return NextResponse.json({ message: "Użytkownik nie znaleziony" }, { status: 404 });
		}

		return NextResponse.json(user, { status: 200 });
	} catch (err) {
		return NextResponse.json({ message: "Błąd", err }, { status: 500 });
	}
}
