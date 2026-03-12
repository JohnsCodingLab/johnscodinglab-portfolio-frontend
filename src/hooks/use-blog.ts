import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { ApiResponse, BlogPost } from "@/types";
import { BlogPostFormData } from "@/lib/validation";

const BLOG_KEY = ["blog-posts"];

export function useBlogPosts() {
    return useQuery({
        queryKey: BLOG_KEY,
        queryFn: async () => {
            const { data } = await api.get<ApiResponse<BlogPost[]>>("/blog");
            return data.data;
        },
    });
}

export function useBlogPost(slug: string) {
    return useQuery({
        queryKey: [...BLOG_KEY, slug],
        queryFn: async () => {
            const { data } = await api.get<ApiResponse<BlogPost>>(
                `/blog/${slug}`,
            );
            return data.data;
        },
        enabled: !!slug,
    });
}

export function useCreateBlogPost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: BlogPostFormData) => {
            const { data } = await api.post<ApiResponse<BlogPost>>(
                "/blog",
                formData,
            );
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: BLOG_KEY });
        },
    });
}

export function useUpdateBlogPost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            slug,
            formData,
        }: {
            slug: string;
            formData: Partial<BlogPostFormData>;
        }) => {
            const { data } = await api.patch<ApiResponse<BlogPost>>(
                `/blog/${slug}`,
                formData,
            );
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: BLOG_KEY });
        },
    });
}

export function useDeleteBlogPost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (slug: string) => {
            await api.delete(`/blog/${slug}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: BLOG_KEY });
        },
    });
}
