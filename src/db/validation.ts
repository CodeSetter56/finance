import z from 'zod'

export const createRecordSchema = z.object({
  userId: z.number().int(),
  amount: z.number().positive({ message: 'Amount must be more tha 0' }),
  type: z.enum(['income', 'expense']),
  category: z.enum([
    'electricity',
    'food',
    'rent',
    'entertainment',
    'transportation',
    'healthcare',
    'education',
    'miscellaneous',
  ]),
  description: z.string().optional(),
  date: z 
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    }),
})

export const createUserSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
  role: z.enum(['admin', 'analyst', 'viewer']).default('viewer'),
})
