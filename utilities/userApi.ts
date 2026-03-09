import { NextResponse } from "next/server";
import type { UpdateRequestBody } from "@/api/users/route";
import { sendVerificationEmail } from "../lib/mail";
import User from "../models/User";
import { generateVerificationToken } from "./token";
import { type CreateUserInput, createUserInDb } from "./userService";

type UserRecord = {
  exercise: string;
  classic: number | null;
  gear: number | null;
};

export const verifyEmail = async (id: string) => {
  const updatedUser = await User.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        isEmailVerified: true,
        emailVerifiedDate: new Date(),
        verificationExpiresAt: null,
      },
    },
    { returnNewDocument: true, returnDocument: "after" },
  );

  if (updatedUser) {
    return NextResponse.json(
      { message: "Updating account successfully", user: updatedUser.email },
      { status: 201 },
    );
  }

  return NextResponse.json(
    { message: "Failed to update account" },
    { status: 404 },
  );
};

export const findUserBySlug = async (slug: string) => {
  try {
    return await User.findOne({ _id: slug });
  } catch (error) {
    console.log(`Find user by ID: ${error}`);
    return null;
  }
};

export const findUser = async (email: string) => {
  try {
    return await User.findOne({ email: email });
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const createNewUser = async (props: CreateUserInput) => {
  try {
    const result = await createUserInDb(props);

    if (result.status === "exists") {
      return NextResponse.json(
        { message: "Account already exist" },
        { status: 409 },
      );
    }

    const { user } = result;

    if (props.provider === "google") {
      const verificationToken = await generateVerificationToken(user.email);
      await sendVerificationEmail(
        user.email,
        verificationToken.token,
        user.name,
      );
    }

    return NextResponse.json(
      { message: "Email Verification was sent" },
      { status: 201 },
    );
  } catch (err) {
    return NextResponse.json(
      { message: `Something went wrong with creating new record: ${err}` },
      { status: 500 },
    );
  }
};

export const handleRegister = async (body: UpdateRequestBody) => {
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return NextResponse.json(
      { message: "Missing registration fields" },
      { status: 400 },
    );
  }

  try {
    return await createNewUser({ name, email, password });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
};

export const handleUpdateRecord = async (id: string, records: UserRecord[]) => {
  const updatedUser = await User.findOneAndUpdate(
    { _id: id },
    { $set: { records } },
    { returnNewDocument: true, returnDocument: "after" },
  );

  if (updatedUser) {
    return NextResponse.json(
      { message: "Updating account successfully", user: updatedUser },
      { status: 201 },
    );
  }

  return NextResponse.json(
    { message: "Failed to update account" },
    { status: 404 },
  );
};

export const handleUpdateProfile = async (
  id: string,
  data: Record<string, unknown>,
) => {
  const updatedUser = await User.findOneAndUpdate(
    { _id: id },
    { $set: data },
    { returnNewDocument: true, returnDocument: "after" },
  );

  console.log("updatedUser", updatedUser);

  if (updatedUser) {
    return NextResponse.json(
      { message: "Updating account successfully", updatedData: data },
      { status: 201 },
    );
  }

  return NextResponse.json(
    { message: "Failed to update account" },
    { status: 404 },
  );
};

export const handleApproval = async (id: string, approved: boolean) => {
  const updatedUser = await User.findOneAndUpdate(
    { _id: id },
    { $set: { approved } },
    { returnNewDocument: true, returnDocument: "after" },
  );

  if (updatedUser) {
    return NextResponse.json(
      {
        message: approved
          ? "Account approved successfully"
          : "Account rejected successfully",
      },
      { status: 201 },
    );
  }

  return NextResponse.json(
    { message: "Failed to update approval status" },
    { status: 404 },
  );
};

export const handleDelete = async (id: string) => {
  try {
    const deleteUser = await User.deleteOne({ _id: id });

    if (deleteUser.acknowledged === true && deleteUser.deletedCount === 1) {
      return NextResponse.json(
        { message: "User removed successfully", status: 200 },
        { status: 200 },
      );
    }
    return NextResponse.json(
      { message: "User removed unsuccessfully" },
      { status: 404 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong with delete user" },
      { status: 500 },
    );
  }
};

export const handleDeleteAll = async () => {
  try {
    await User.deleteMany({});

    return NextResponse.json({ message: "wywalone" }, { status: 404 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong while deleting all users" },
      { status: 500 },
    );
  }
};
