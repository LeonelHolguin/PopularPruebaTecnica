import { z } from "zod";

export const ProfileSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  email: z.string().email("Correo inválido"),
  cellphone: z.string().optional(),
  address: z.string().optional(),
});
