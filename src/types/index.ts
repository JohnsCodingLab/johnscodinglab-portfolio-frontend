export interface Project {
    id: string;
    title: string;
    slug: string;
    description: string;
    about: string;
    techStack: string[];
    githubUrl: string | null;
    previewUrl: string | null;
    coverImage: string | null;
    featured: boolean;
    published: boolean;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
}

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    coverImage: string | null;
    tags: string[];
    published: boolean;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ContactMessage {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    read: boolean;
    createdAt: string;
}

export interface PageView {
    id: string;
    path: string;
    referrer: string | null;
    userAgent: string | null;
    ipHash: string | null;
    country: string | null;
    createdAt: string;
}

// User (returned from login)
export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}

// Auth response from POST /api/auth/login
export interface AuthResponse {
    accessToken: string;
    user: User;
}

// API envelope — your backend wraps responses in { success: true, data: ... }
export interface ApiResponse<T> {
    success: boolean;
    data: T;
}
