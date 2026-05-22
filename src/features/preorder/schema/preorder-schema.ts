import { z } from "zod";

export const preorderSchema = z.object({
  fullName: z.string().min(2, "Vui long nhap ten hop le"),
  email: z.email("Email khong hop le"),
  phone: z.string().min(9, "So dien thoai khong hop le"),
  note: z.string().max(300, "Ghi chu toi da 300 ky tu").optional()
});

export type PreorderInput = z.infer<typeof preorderSchema>;
