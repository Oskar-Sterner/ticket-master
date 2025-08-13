import {
  CreateTicketRequest,
  Ticket,
  UpdateTicketRequest,
  TicketWithUser,
} from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const QUERY_KEYS = {
  tickets: ["tickets"] as const,
  ticket: (id: string) => ["tickets", id] as const,
  projects: ["projects"] as const,
  project: (id: string) => ["projects", id] as const,
  users: ["users"] as const,
} as const;

const ticketApi = {
  getAll: async (): Promise<TicketWithUser[]> => {
    try {
      return await apiClient.get(`${API_BASE_URL}/tickets`);
    } catch {
      return [];
    }
  },
  getById: (id: string): Promise<TicketWithUser> =>
    apiClient.get(`${API_BASE_URL}/tickets/${id}`),
  create: (data: CreateTicketRequest): Promise<Ticket> =>
    apiClient.post(`${API_BASE_URL}/tickets`, data),
  update: (id: string, data: UpdateTicketRequest): Promise<Ticket> =>
    apiClient.put(`${API_BASE_URL}/tickets/${id}`, data),
  delete: (id: string): Promise<void> =>
    apiClient.delete(`${API_BASE_URL}/tickets/${id}`),
} as const;

export const useTickets = () => {
  return useQuery({
    queryKey: QUERY_KEYS.tickets,
    queryFn: ticketApi.getAll,
    staleTime: 5 * 60 * 1000,
  });
};

export const useTicket = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.ticket(id),
    queryFn: () => ticketApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ticketApi.create,
    onSuccess: (newTicket) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.project(newTicket.projectId),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tickets });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
    },
  });
};

export const useUpdateTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTicketRequest }) =>
      ticketApi.update(id, data),
    onSuccess: (updatedTicket, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.project(updatedTicket.projectId),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tickets });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ticket(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
    },
  });
};

export const useDeleteTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ticketApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tickets });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
    },
  });
};
