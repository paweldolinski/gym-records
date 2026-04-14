import { v4 as uuid4 } from "uuid";
import VerificationToken, {
  type VerificationTokenDocument,
} from "../models/verificationToken";

export const getVerificationTokenByToken = async (
  token: string,
): Promise<VerificationTokenDocument | null> => {
  try {
    return await VerificationToken.findOne({ token });
  } catch (error) {
    console.error("getVerificationTokenByToken error", error);
    return null;
  }
};

export const deleteVerificationToken = async (email: string) => {
  try {
    const deleteToken = await VerificationToken.deleteOne({ email });
    return deleteToken.acknowledged === true && deleteToken.deletedCount === 1;
  } catch (error) {
    console.error("deleteVerificationToken error", error);
    return false;
  }
};

const getVerificationTokenByEmail = async (
  email: string,
): Promise<VerificationTokenDocument | null> => {
  try {
    return await VerificationToken.findOne({ email });
  } catch (error) {
    console.error(`getVerificationTokenByEmail ${error}`);
    return null;
  }
};

export const generateVerificationToken = async (email: string) => {
  const token = uuid4();
  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await VerificationToken.findOneAndUpdate(
      { _id: existingToken.id },
      { $unset: { token: "" } },
    );
  }

  const verificationToken = await VerificationToken.create({
    email,
    token,
    verificationExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  return verificationToken;
};
