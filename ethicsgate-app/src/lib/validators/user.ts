import { z } from 'zod';

export const signupSchema = z.object({
    organizationName: z.string().min(2, 'Organization name must be at least 2 characters').max(100),
    organizationSlug: z.string()
        .min(3, 'Slug must be at least 3 characters')
        .max(50)
        .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
});

export const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const inviteUserSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    role: z.enum(['researcher', 'reviewer', 'admin']),
    fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
});

export const updateUserSchema = z.object({
    fullName: z.string().min(2).max(100).optional(),
    role: z.enum(['researcher', 'reviewer', 'admin']).optional(),
    avatar_url: z.string().url().nullable().optional(),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type InviteUserInput = z.infer<typeof inviteUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
