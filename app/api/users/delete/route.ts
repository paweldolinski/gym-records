import { handleDelete } from "../../../../lib/services/userService";
import { deleteSchema } from "../../../../lib/validators/userValidators";
import { errorResponse, successResponse } from "../../../../lib/api/response";

export async function DELETE(req: Request) {
  const body = await req.json();
  const parseResult = deleteSchema.safeParse(body);

  if (!parseResult.success) {
    return errorResponse(parseResult.error.errors[0]?.message ?? "Invalid payload", 400);
  }

  const deleteResult = await handleDelete(parseResult.data.id);

  if (deleteResult?.acknowledged === true && deleteResult.deletedCount === 1) {
    return successResponse({ message: "User removed successfully" }, 200);
  }

  return errorResponse("User removed unsuccessfully", 404);
}
