import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().positive("Price must be a positive number"),
  inStock: z.boolean(),
  categoryId: z.number().int().positive("Category ID must be a positive integer"),
});