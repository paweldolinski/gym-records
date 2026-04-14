import bcrypt from 'bcrypt';
import { connectDB } from './mongodb';
import User, { type UserDocument } from '../models/User';

export type CreateUserInput = {
  email: string;
  password?: string;
  name: string;
  image?: string;
  provider?: 'google' | 'credentials';
  terms?: boolean;
};

export type UserRecord = {
  exercise: string;
  classic: string | null;
  gear: string | null;
};

const emptyRecords: UserRecord[] = [
  { exercise: 'squat', classic: '', gear: '' },
  { exercise: 'press', classic: '', gear: '' },
  { exercise: 'lift', classic: '', gear: '' },
];

export async function createUserInDb({
  email,
  password,
  name,
  image = '',
  provider = 'credentials',
  terms,
}: CreateUserInput) {
  await connectDB();

  const existingUser = await User.findOne({ email });
  const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
  const isGoogle = provider === 'google';

  if (existingUser) {
    return { status: 'exists' as const };
  }

  const user = await User.create({
    email,
    name,
    records: emptyRecords,
    terms: terms ?? !isGoogle,
    isAdmin: false,
    approved: false,
    img: image,
    password: hashedPassword,
    isEmailVerified: isGoogle,
    ...(!isGoogle && {
      verificationExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    }),
  });

  return { status: 'created' as const, user };
}

export const findUserBySlug = async (slug: string) => {
  try {
    await connectDB();
    return await User.findOne({ _id: slug });
  } catch (error) {
    console.error(`Find user by ID failed: ${error}`);
    return null;
  }
};

export const findUser = async (email: string) => {
  try {
    await connectDB();
    return await User.findOne({ email });
  } catch (error) {
    console.error(`Find user by email failed: ${error}`);
    return null;
  }
};

export const getAllUsers = async (): Promise<unknown[]> => {
  try {
    await connectDB();
    return await User.find().lean();
  } catch (error) {
    console.error(`Get all users failed: ${error}`);
    throw error;
  }
};

export const verifyEmailById = async (id: string) => {
  try {
    await connectDB();
    return await User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          isEmailVerified: true,
          emailVerifiedDate: new Date(),
          verificationExpiresAt: null,
        },
      },
      { returnNewDocument: true, returnDocument: 'after' },
    );
  } catch (error) {
    console.error(`Verify email failed: ${error}`);
    return null;
  }
};

export const updateUserRecords = async (
  id: string,
  records: UserRecord[],
): Promise<UserDocument | null> => {
  try {
    await connectDB();
    return await User.findOneAndUpdate(
      { _id: id },
      { $set: { records } },
      { returnNewDocument: true, returnDocument: 'after' },
    );
  } catch (error) {
    console.error(`Update records failed: ${error}`);
    return null;
  }
};

export const updateUserProfile = async (
  id: string,
  data: Record<string, unknown>,
): Promise<UserDocument | null> => {
  try {
    await connectDB();
    return await User.findOneAndUpdate(
      { _id: id },
      { $set: data },
      { returnNewDocument: true, returnDocument: 'after' },
    );
  } catch (error) {
    console.error(`Update profile failed: ${error}`);
    return null;
  }
};

export const setApproval = async (
  id: string,
  approved: boolean,
): Promise<UserDocument | null> => {
  try {
    await connectDB();
    return await User.findOneAndUpdate(
      { _id: id },
      { $set: { approved } },
      { returnNewDocument: true, returnDocument: 'after' },
    );
  } catch (error) {
    console.error(`Set approval failed: ${error}`);
    return null;
  }
};

export const deleteUserById = async (id: string) => {
  try {
    await connectDB();
    return await User.deleteOne({ _id: id });
  } catch (error) {
    console.error(`Delete user failed: ${error}`);
    return null;
  }
};

export const deleteAllUsers = async () => {
  try {
    await connectDB();
    return await User.deleteMany({});
  } catch (error) {
    console.error(`Delete all users failed: ${error}`);
    return null;
  }
};
