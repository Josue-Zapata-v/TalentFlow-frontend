import { apiClient } from "@/lib/api-client";
import { Pagination, PublicUser, Rol } from "@/types/shared";

export interface UsersFilters {
  rol?: Rol;
  page?: number;
  limit?: number;
}

export interface UsersListResult {
  users: PublicUser[];
  pagination: Pagination;
}

function buildQueryString(filters: UsersFilters): string {
  const params = new URLSearchParams();
  if (filters.rol) params.set("rol", filters.rol);
  if (filters.page) params.set("page", String(filters.page));
  if (filters.limit) params.set("limit", String(filters.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const usersService = {
  list: (filters: UsersFilters = {}) => apiClient.get<UsersListResult>(`/users${buildQueryString(filters)}`),

  update: (id: string, data: { nombre?: string; rol?: Rol }) =>
    apiClient.patch<{ user: PublicUser }>(`/users/${id}`, data),

  remove: (id: string) => apiClient.delete<null>(`/users/${id}`),
};
