import { getAllUsers } from "../../../lib/services/userService";
import { errorResponse, successResponse } from "../../../lib/api/response";

export async function GET() {
  try {
    const users = await getAllUsers();
    return successResponse(users, 200);
  } catch (e) {
    return errorResponse("Unable to retrieve users", 500, { error: e });
  }
}

