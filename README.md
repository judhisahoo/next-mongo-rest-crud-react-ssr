#### Create a new Next.js app with TypeScript, ESLint, and Tailwind

npx create-next-app@latest next-ssr-nest --typescript --eslint --tailwind --app

#### Navigate to the project directory

cd next-ssr-nest

#### Install Redux Toolkit and Axios

npm install @reduxjs/toolkit react-redux axios

#### install prettier and linter

npm install --save-dev prettier prettier-plugin-tailwindcss eslint-config-prettier

##### .prettierrc

```json
// .prettierrc
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 80,
  "semi": true,
  "tabWidth": 2
}
```

#### Install Husky

npm install --save-dev husky

#### Initialize Husky

npx husky init

#### Add a pre-commit hook

npx husky add .husky/pre-commit "npm run lint && npm run format"

```json
"scripts": {
  "lint": "next lint",
  "format": "prettier --write ."
}
```

### though we are accessing images from 3rd party url we may got error next js. so need to update nest js config for 3rd party image

```js
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        pathname: '/api/portraits/**',
      },
    ],
  },
  /* other config options here */
};

export default nextConfig;
```

#### Input validation and sanitization are crucial for security. we will use "zod" and "dompurify"

##### Step 1: Install the Necessary Packages

```sh
npm install zod dompurify libphonenumber-js
```

##### Step 2: Create a Validation Schema

#### create file as src/lib/validation/auth.ts

```js
import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters long'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone must be at lest 10'),
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
    message: ' Password do not maatch',
    path: ['confpassword'],
  });

// Infer the TypeScript type from the schema for type safety
export type RegisterFormInputs = z.infer<typeof registerSchema>;
```

##### Step 3: Update the Registration Page (register/page.tsx)

```js
// add bellow import with old other import at import section
import { registerSchema } from '@/lib/validation/auth'; // Import the schema

// update bellow code with older "error" and "setError" with "usestate" part
const [errors, setErrors] = useState<{ [key: string]: string }>({}); // State to hold validation errors

// Sanitize the name input
  const sanitizedName = DOMPurify.sanitize(name);

  //with in try brlock as bellow code

  // Validate form data using Zod before process api call
  registerSchema.parse({
        name: sanitizedName,
        email,
        password,
        phone: sanitizedPhone,
        age: Number(age),
        dob,
        confpassword,
      });

  // updatethe code at bellow section also
  // Call the register API helper function
  await register({ name: sanitizedName, email, password });

  //update code for catch section not finally section for error block to show error to user
  if (err instanceof z.ZodError) {
    // Handle Zod validation errors
    const newErrors: { [key: string]: string } = {};
    for (const issue of err.issues) {
      newErrors[issue.path[0]] = issue.message;
    }
    setErrors(newErrors);
  } else {
    // Handle API errors
    setApiError('Registration failed. Please try again.');
  }

  //in hide error for correct data in each field change code for onChange event code as bellow

onChange={(e) => {
                  setName(e.target.value);
                  setErrors((prevErrors) => ({
                    ...prevErrors,
                    name: undefined,
                  }));
                }}
// to show error message for invalide data in side a <p> tag as bellow for each field
{errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
```
