import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { ApiResponse, ContactMessage } from "@/types";

const CONTACTS_KEY = ["contacts"];

export function useContacts() {
    return useQuery({
        queryKey: CONTACTS_KEY,
        queryFn: async () => {
            const { data } =
                await api.get<ApiResponse<ContactMessage[]>>("/contact");
            return data.data;
        },
    });
}

export function useMarkAsRead() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await api.patch<ApiResponse<ContactMessage>>(
                `/contact/${id}/read`,
            );
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CONTACTS_KEY });
        },
    });
}

export function useDeleteContact() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/contact/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CONTACTS_KEY });
        },
    });
}

export function useReplyToContact() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            message,
        }: {
            id: string;
            message: string;
        }) => {
            const { data } = await api.post<ApiResponse<ContactMessage>>(
                `/contact/${id}/reply`,
                { message },
            );
            return data.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CONTACTS_KEY });
        },
    });
}
