import { z } from "zod";

interface ValidationMessages {
  fullName: string;
  email: string;
  phone: string;
  note: string;
}

export function getPreorderSchema(validation: ValidationMessages) {
  return z.object({
    fullName: z.string().min(2, validation.fullName),
    email: z.email(validation.email),
    phone: z.string().min(9, validation.phone),
    note: z.string().max(300, validation.note).optional()
  });
}

export type PreorderInput = {
  fullName: string;
  email: string;
  phone: string;
  note?: string;
};
