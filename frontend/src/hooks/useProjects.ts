import {
  CreateProjectRequest,
  Project,
  UpdateProjectRequest,
  ProjectWithTickets,
} from "@/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const QUERY_KEYS = {
  projects: ["projects"] as const,
  project: (id: string) => ["projects", id] as const,
  users: ["users"] as const,
} as const;

const projectApi = {
  getAll: async (): Promise<ProjectWithTickets[]> => {
    try {
      return await apiClient.get(`${API_BASE_URL}/projects`);
    } catch {
      return [];
    }
  },
  getById: (id: string): Promise<ProjectWithTickets> =>
    apiClient.get(`${API_BASE_URL}/projects/${id}`),
  create: (data: CreateProjectRequest): Promise<Project> =>
    apiClient.post(`${API_BASE_URL}/projects`, data),
  update: (id: string, data: UpdateProjectRequest): Promise<Project> =>
    apiClient.put(`${API_BASE_URL}/projects/${id}`, data),
  delete: (id: string): Promise<void> =>
    apiClient.delete(`${API_BASE_URL}/projects/${id}`),
} as const;

export const useProjects = () => {
  return useQuery({
    queryKey: QUERY_KEYS.projects,
    queryFn: projectApi.getAll,
    staleTime: 5 * 60 * 1000,
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.project(id),
    queryFn: () => projectApi.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: projectApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProjectRequest }) =>
      projectApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.project(id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: projectApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.projects });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
    },
  });
};
