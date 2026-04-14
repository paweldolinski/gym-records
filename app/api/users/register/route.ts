import { handleRegister } from "../../../../lib/services/userService";
import { registerSchema } from "../../../../lib/validators/userValidators";
import { errorResponse, successResponse } from "../../../../lib/api/response";

export async function POST(req: Request) {
  const body = await req.json();
  const parseResult = registerSchema.safeParse(body);

  if (!parseResult.success) {
    return errorResponse(parseResult.error.errors[0]?.message ?? "Invalid payload", 400);
  }

  const result = await handleRegister(parseResult.data);

  if (result.status === "invalid") {
    return errorResponse(result.message, 400);
  }

  if (result.status === "exists") {
    return errorResponse("Account already exists", 409);
  }

  return successResponse(
    {
      message: result.verificationEmailSent
        ? "Email verification was sent"
        : "Account created",
    },
    201,
  );
}
