import { z } from "zod";

// Login form validation
export const loginSchema = z.object({
    email: z.email("Enter a valid email"),
    password: z.string().min(1, "Password is required"),
});

// Project form — matches your Prisma Project model fields
export const projectSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z
        .string()
        .min(1, "Slug is required")
        .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
    description: z.string().min(1, "Description is required"),
    about: z.string().min(1, "About section is required"),
    techStack: z.array(z.string()).min(1, "Add at least one technology"),
    githubUrl: z.string().url().optional().or(z.literal("")),
    previewUrl: z.string().url().optional().or(z.literal("")),
    coverImage: z.string().optional(),
    featured: z.boolean(),
    published: z.boolean(),
    sortOrder: z.number().int(),
});

// Blog post form
export const blogPostSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z
        .string()
        .min(1, "Slug is required")
        .regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
    content: z.string().min(1, "Content is required"),
    excerpt: z.string().optional(),
    coverImage: z.string().optional(),
    tags: z.array(z.string()),
    published: z.boolean(),
});

// Infer TypeScript types from schemas — these are used by react-hook-form
export type LoginFormData = z.infer<typeof loginSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type BlogPostFormData = z.infer<typeof blogPostSchema>;
