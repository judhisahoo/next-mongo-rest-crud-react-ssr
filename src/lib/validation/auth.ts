import parsePhoneNumberFromString from 'libphonenumber-js';
import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters long'),
    email: z.string().email('Invalid email address'),
    phone: z
      .string()
      .min(10, 'Phone must be at lest 10')
      .transform((arg, ctx) => {
        const phoneNo = parsePhoneNumberFromString(arg, {
          // set this to use a default country when the phone number omits country code
          defaultCountry: 'IN',
          // set to false to require that the whole string is exactly a phone number,
          // otherwise, it will search for a phone number anywhere within the string
          extract: false,
        });
        // when it's good
        if (phoneNo && phoneNo.isValid()) {
          return phoneNo.number;
        }

        // when it's not
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Invalid Phone number',
        });
        return z.NEVER;
      }),
    age: z.number().optional(),
    dob: z.iso.date(),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters long')
      .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
      .regex(/[0-9]/, { message: 'Contain at least one number.' })
      .regex(/[^a-zA-Z0-9]/, {
        message: 'Contain at least one special character.',
      })
      .trim(),
    confpassword: z.string(),
  })
  .refine((data) => data.password === data.confpassword, {
    message: 'Password do not maatch with Confirm password',
    path: ['confpassword'],
  });

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

// Infer the TypeScript type from the schema for type safety
export type RegisterFormInputs = z.infer<typeof registerSchema>;
export type LoginFormInputs = z.infer<typeof loginSchema>;
