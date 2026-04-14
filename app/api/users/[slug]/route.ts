import { findUserBySlug } from "../../../../lib/services/userService";
import { errorResponse, successResponse } from "../../../../lib/api/response";

export async function GET(req: Request) {
  const { pathname } = new URL(req.url);
  const slug = pathname.split("/").pop();

  if (!slug) {
    return errorResponse("Missing slug parameter", 400);
  }

  try {
    const user = await findUserBySlug(slug);

    if (!user) {
      return errorResponse("Użytkownik nie znaleziony", 404);
    }

    return successResponse(user, 200);
  } catch (err) {
    return errorResponse("Błąd serwera", 500, { error: err });
  }
}
