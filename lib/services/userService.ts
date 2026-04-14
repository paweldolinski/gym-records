import { sendVerificationEmail } from "../mail";
import { generateVerificationToken } from "../token";
import {
  type CreateUserInput,
  createUserInDb,
  findUserBySlug as findUserBySlugInDb,
  findUser as findUserInDb,
  getAllUsers as getAllUsersInDb,
  verifyEmailById,
  updateUserRecords as updateUserRecordsInDb,
  updateUserProfile as updateUserProfileInDb,
  setApproval as setApprovalInDb,
  deleteUserById,
  deleteAllUsers,
} from "../userDataAccess";
import type { UserDocument } from "../../models/User";

export type CreateUserResult =
  | { status: "exists" }
  | { status: "created"; user: UserDocument; verificationEmailSent?: boolean };

export type RegisterResult =
  | CreateUserResult
  | { status: "invalid"; message: string };

export type UserRecord = {
  exercise: string;
  classic: string | null;
  gear: string | null;
};

type RegisterInput = {
  name?: string;
  email?: string;
  password?: string;
  terms?: boolean;
  provider?: "google" | "credentials";
  image?: string;
};

export const createNewUser = async (
  props: CreateUserInput,
): Promise<CreateUserResult> => {
  const result = await createUserInDb(props);

  if (result.status === "created" && props.provider !== "google") {
    const verificationToken = await generateVerificationToken(props.email);
   // await sendVerificationEmail(props.email, verificationToken.token, props.name);
    return { ...result, verificationEmailSent: true };
  }

  return result;
};

export const getAllUsers = async () => {
  return await getAllUsersInDb();
};

export const findUserBySlug = async (slug: string) => {
  return await findUserBySlugInDb(slug);
};

export const findUser = async (email: string) => {
  return await findUserInDb(email);
};

export const verifyEmail = async (id: string) => {
  return await verifyEmailById(id);
};

export const handleRegister = async (
  body: RegisterInput,
): Promise<RegisterResult> => {
  const { name, email, password, terms } = body;

  if (!name || !email || !password) {
    return { status: "invalid", message: "Missing registration fields" };
  }

  return await createNewUser({
    name,
    email,
    password,
    provider: "credentials",
    terms,
  });
};

export const handleUpdateRecord = async (
  id: string,
  records: UserRecord[],
) => {
  return await updateUserRecordsInDb(id, records);
};

export const handleUpdateProfile = async (
  id: string,
  data: Record<string, unknown>,
) => {
  return await updateUserProfileInDb(id, data);
};

export const handleApproval = async (
  id: string,
  approved: boolean,
) => {
  return await setApprovalInDb(id, approved);
};

export const handleDelete = async (id: string) => {
  return await deleteUserById(id);
};

export const handleDeleteAll = async () => {
  return await deleteAllUsers();
};

