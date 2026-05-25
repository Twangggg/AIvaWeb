import { z } from "zod";

interface ValidationMessages {
  fullName: string;
  fullNamePattern: string;
  fullNameMax: string;
  email: string;
  phone: string;
  phonePattern: string;
  note: string;
}

export function getPreorderSchema(validation: ValidationMessages) {
  return z.object({
    fullName: z
      .string()
      .trim()
      .min(2, validation.fullName)
      .max(50, validation.fullNameMax)
      .regex(/^[a-zA-ZÀ-ỹ]+(?: [a-zA-ZÀ-ỹ]+)*$/, validation.fullNamePattern),
    email: z
      .string()
      .trim()
      .email(validation.email)
      .toLowerCase(),
    phone: z
      .string()
      .trim()
      .regex(/^(0|\+84)[0-9]{9,10}$/, validation.phonePattern),
    note: z
      .string()
      .trim()
      .max(300, validation.note)
      .optional()
      .transform((val) => (val && val.length > 0 ? val : undefined))
  });
}

export type PreorderInput = {
  fullName: string;
  email: string;
  phone: string;
  note?: string;
};
