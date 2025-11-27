import { NextResponse } from "next/server";
import { v4 as uuid4 } from "uuid";
import VerificationToken, {
  type VerificationTokenDocument,
} from "../../models/verificationToken";

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const existingToken = await VerificationToken.find({ token: token });
    return existingToken;
  } catch (error) {
    console.log(error);
  }
};

export const deleteVerificationToken = async (email: string) => {
  try {
    const deleteToken = await VerificationToken.deleteOne({ email: email });

    if (deleteToken.acknowledged === true && deleteToken.deletedCount === 1) {
      return NextResponse.json(
        { message: "Token removed", status: 200 },
        { status: 200 },
      );
    }
    return NextResponse.json(
      { message: "Token removed unsuccesfully" },
      { status: 404 },
    );
  } catch (error) {
    console.log(error);
  }
};

const getVerificationTokenByEmail = async (
  email: string,
): Promise<VerificationTokenDocument | null> => {
  try {
    return await VerificationToken.findOne({ email: email });
  } catch (error) {
    console.log(`getVerificationTokenByEmail ${error}`);
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

  const veryficationToken = await VerificationToken.create({
    email,
    token,
    verificationExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  return veryficationToken;
};
