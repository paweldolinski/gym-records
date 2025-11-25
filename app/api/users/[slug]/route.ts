// app/api/users/[slug]/route.ts
import { NextResponse } from "next/server";
import { findUserBySlug } from "@/utilities/user";
import { connectDB } from "../../../../lib/mongodb";

export async function GET(req: Request) {
  const { pathname } = new URL(req.url);
  const parts = pathname.split("/").filter(Boolean);
  const slug = parts[parts.indexOf("users") + 1];

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
