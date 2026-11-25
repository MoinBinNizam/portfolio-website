import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { LoginInput, ProfileUpdate } from '@portfolio/shared';
import type { ProfileItem } from '../public/types';
import { apiRequest } from '../../lib/api';

export interface AuthUser {
  id: string;
  email: string;
}

export interface DashboardCounts {
  experience: number;
  education: number;
  certifications: number;
  achievements: number;
  projects: number;
  skills: number;
  services: number;
  posts: number;
  unreadMessages: number;
  totalMessages: number;
}

export interface ContactMessageItem {
  _id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export function useAuthMe() {
  return useQuery({
    queryKey: ['auth', 'me'],
    retry: false,
    queryFn: async () => (await apiRequest<AuthUser>('/auth/me')).data,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: LoginInput) =>
      (
        await apiRequest<AuthUser>('/auth/login', {
          method: 'POST',
          body: JSON.stringify(input),
        })
      ).data,
    onSuccess: (user) => {
      qc.setQueryData(['auth', 'me'], user);
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () =>
      (await apiRequest<{ loggedOut: boolean }>('/auth/logout', { method: 'POST' })).data,
    onSuccess: () => {
      qc.removeQueries({ queryKey: ['auth'] });
    },
  });
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => (await apiRequest<{ counts: DashboardCounts }>('/admin/dashboard')).data,
  });
}

export function useAdminProfile() {
  return useQuery({
    queryKey: ['admin', 'profile'],
    queryFn: async () => (await apiRequest<ProfileItem | null>('/admin/profile')).data,
  });
}

export function useUpdateAdminProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ProfileUpdate) =>
      (
        await apiRequest<ProfileItem>('/admin/profile', {
          method: 'PUT',
          body: JSON.stringify(input),
        })
      ).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'profile'] });
      void qc.invalidateQueries({ queryKey: ['public', 'profile'] });
    },
  });
}

export function useAdminMessages() {
  return useQuery({
    queryKey: ['admin', 'messages'],
    queryFn: async () => (await apiRequest<ContactMessageItem[]>('/admin/messages')).data,
  });
}

export function useMarkMessageRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, read }: { id: string; read: boolean }) =>
      (
        await apiRequest<ContactMessageItem>(`/admin/messages/${id}`, {
          method: 'PATCH',
          body: JSON.stringify({ read }),
        })
      ).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'messages'] });
      void qc.invalidateQueries({ queryKey: ['admin', 'dashboard'] });
    },
  });
}
