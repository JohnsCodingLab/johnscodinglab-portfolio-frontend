import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { ApiResponse, Project } from "@/types";
import { ProjectFormData } from "@/lib/validation";

// A constant key so every hook references the same cache entry.
const PROJECTS_KEY = ["projects"];

// ─── FETCH ALL ─────────────────────────────────────────────
export function useProjects() {
    return useQuery({
        queryKey: PROJECTS_KEY,
        queryFn: async () => {
            const { data } = await api.get<ApiResponse<Project[]>>("/projects");
            return data.data; // unwrap your backend's { success, data } envelope
        },
    });
}

// ─── FETCH ONE ─────────────────────────────────────────────
export function useProject(slug: string) {
    return useQuery({
        queryKey: [...PROJECTS_KEY, slug],
        queryFn: async () => {
            const { data } = await api.get<ApiResponse<Project>>(
                `/projects/${slug}`,
            );
            return data.data;
        },
        enabled: !!slug, // only runs when id is truthy
    });
}

// ─── CREATE ────────────────────────────────────────────────
export function useCreateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData: ProjectFormData) => {
            const { data } = await api.post<ApiResponse<Project>>(
                "/projects",
                formData,
            );
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PROJECTS_KEY });
        },
    });
}

// ─── UPDATE ────────────────────────────────────────────────
export function useUpdateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            slug,
            formData,
        }: {
            slug: string;
            formData: Partial<ProjectFormData>;
        }) => {
            const { data } = await api.patch<ApiResponse<Project>>(
                `/projects/${slug}`,
                formData,
            );
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PROJECTS_KEY });
        },
    });
}

// ─── DELETE ────────────────────────────────────────────────
export function useDeleteProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (slug: string) => {
            await api.delete(`/projects/${slug}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PROJECTS_KEY });
        },
    });
}
