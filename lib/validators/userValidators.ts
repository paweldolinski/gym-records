import { z } from "zod";

const userRecordSchema = z.object({
  exercise: z.string().min(1, "Exercise is required"),
  classic: z.string().nullable(),
  gear: z.string().nullable(),
});

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  terms: z.boolean(),
  provider: z.enum(["google", "credentials"]).optional(),
  image: z.string().optional(),
});

export const profileUpdateSchema = z.object({
  id: z.string().min(1, "ID is required"),
  data: z.record(z.unknown()),
});

export const recordsUpdateSchema = z.object({
  id: z.string().min(1, "ID is required"),
  records: z.array(userRecordSchema),
});

export const approvalSchema = z.object({
  id: z.string().min(1, "ID is required"),
  approve: z.boolean(),
});

export const deleteSchema = z.object({
  id: z.string().min(1, "ID is required"),
});

export const imageUpdateSchema = z.object({
  id: z.string().min(1, "ID is required"),
  img: z.string().min(1, "Image payload must be a string"),
});

export type RegisterPayload = z.infer<typeof registerSchema>;
export type ProfileUpdatePayload = z.infer<typeof profileUpdateSchema>;
export type RecordsUpdatePayload = z.infer<typeof recordsUpdateSchema>;
export type ApprovalPayload = z.infer<typeof approvalSchema>;
export type DeletePayload = z.infer<typeof deleteSchema>;
export type ImageUpdatePayload = z.infer<typeof imageUpdateSchema>;

