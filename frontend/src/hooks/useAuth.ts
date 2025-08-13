import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateUserRequest, User } from "@/types";
import { apiClient } from "@/lib/apiClient";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const authApi = {
  register: async (data: CreateUserRequest): Promise<User> => {
    try {
      return await apiClient.post(`${API_BASE_URL}/register`, data);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Registration failed"
      );
    }
  },
} as const;

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
