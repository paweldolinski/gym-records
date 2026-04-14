import { newVerification } from "../../../lib/services/verificationService";
import { errorResponse, successResponse } from "../../../lib/api/response";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return errorResponse("Token is required", 400);
  }

  try {
    const result = await newVerification(token);

    if (result.error) {
      return errorResponse(result.error, 400);
    }

    return successResponse({ message: result.success }, 200);
  } catch (error) {
    console.error("Verification route error:", error);
    return errorResponse("Internal server error", 500);
  }
}
