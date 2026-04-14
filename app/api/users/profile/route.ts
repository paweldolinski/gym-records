import { handleUpdateProfile } from "../../../../lib/services/userService";
import { profileUpdateSchema } from "../../../../lib/validators/userValidators";
import { errorResponse, successResponse } from "../../../../lib/api/response";

export async function POST(req: Request) {
  const body = await req.json();
  const parseResult = profileUpdateSchema.safeParse(body);

  if (!parseResult.success) {
    return errorResponse(parseResult.error.errors[0]?.message ?? "Invalid payload", 400);
  }

  const updatedUser = await handleUpdateProfile(parseResult.data.id, parseResult.data.data);

  if (!updatedUser) {
    return errorResponse("Failed to update account", 404);
  }

  return successResponse(
    { message: "Updating account successfully", updatedData: parseResult.data.data },
    200,
  );
}
