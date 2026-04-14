import { v2 as cloudinary } from "cloudinary";
import { handleUpdateProfile } from "../../../../lib/services/userService";
import { imageUpdateSchema } from "../../../../lib/validators/userValidators";
import { errorResponse, successResponse } from "../../../../lib/api/response";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  const body = await req.json();
  const parseResult = imageUpdateSchema.safeParse(body);

  if (!parseResult.success) {
    return errorResponse(parseResult.error.errors[0]?.message ?? "Invalid payload", 400);
  }

  try {
    const { id, img } = parseResult.data;
    const uploadRes = await cloudinary.uploader.upload(img, {
      folder: "profile-photos",
    });

    const updatedUser = await handleUpdateProfile(id, {
      img: uploadRes.secure_url,
    });

    if (!updatedUser) {
      return errorResponse("Failed to update profile image", 400);
    }

    return successResponse({ url: uploadRes.secure_url }, 200);
  } catch (error) {
    return errorResponse("Image upload failed", 400, { error });
  }
}
