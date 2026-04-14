import { NextResponse } from "next/server";

export const successResponse = (
  data: unknown,
  status = 200,
): NextResponse => {
  return NextResponse.json({ success: true, data }, { status });
};

export const errorResponse = (
  message: string,
  status = 400,
  data?: unknown,
): NextResponse => {
  return NextResponse.json({ success: false, message, data }, { status });
};
