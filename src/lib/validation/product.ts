import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters long.'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters long.'),
  price: z.number().min(0.01, 'Price must be a positive number.'),
  qty: z.number().min(1, 'Price must be a positive number.'),
  image: z.string(),
  upc: z.string(),
  category: z.string(),
});

// Infer the TypeScript type from the schema
export type ProductFormData = z.infer<typeof productSchema>;
