import { handleApproval } from "../../../../lib/services/userService";
import { approvalSchema } from "../../../../lib/validators/userValidators";
import { errorResponse, successResponse } from "../../../../lib/api/response";

export async function POST(req: Request) {
  const body = await req.json();
  const parseResult = approvalSchema.safeParse(body);

  if (!parseResult.success) {
    return errorResponse(parseResult.error.errors[0]?.message ?? "Invalid payload", 400);
  }

  const updatedUser = await handleApproval(parseResult.data.id, parseResult.data.approve);

  if (!updatedUser) {
    return errorResponse("Failed to update approval status", 404);
  }

  return successResponse(
    {
      message: parseResult.data.approve
        ? "Account approved successfully"
        : "Account rejected successfully",
    },
    200,
  );
}
