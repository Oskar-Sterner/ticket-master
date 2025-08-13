import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { User, UserWithDetails, UpdateUserRequest } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const QUERY_KEYS = {
  users: ["users"] as const,
  user: (id: string) => ["users", id] as const,
} as const;

const userApi = {
  getAll: async (): Promise<UserWithDetails[]> => {
    try {
      return await apiClient.get(`${API_BASE_URL}/users`);
    } catch {
      return [];
    }
  },
  getById: (id: string): Promise<UserWithDetails> =>
    apiClient.get(`${API_BASE_URL}/users/${id}`),
  update: (id: string, data: UpdateUserRequest): Promise<User> =>
    apiClient.put(`${API_BASE_URL}/users/${id}`, data),
} as const;

export const useUsers = () => {
  return useQuery({
    queryKey: QUERY_KEYS.users,
    queryFn: userApi.getAll,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.user(id),
    queryFn: () => userApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) =>
      userApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user(id) });
    },
  });
};
