import { handleUpdateRecord } from "../../../../lib/services/userService";
import { recordsUpdateSchema } from "../../../../lib/validators/userValidators";
import { errorResponse, successResponse } from "../../../../lib/api/response";

export async function POST(req: Request) {
  const body = await req.json();
  const parseResult = recordsUpdateSchema.safeParse(body);

  if (!parseResult.success) {
    return errorResponse(parseResult.error.errors[0]?.message ?? "Invalid payload", 400);
  }

  const updatedUser = await handleUpdateRecord(parseResult.data.id, parseResult.data.records);

  if (!updatedUser) {
    return errorResponse("Failed to update account", 404);
  }

  return successResponse({ message: "Updating account successfully", user: updatedUser }, 200);
}
