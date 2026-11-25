import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AchievementInput, AchievementUpdate } from '@portfolio/shared';
import { apiRequest } from '../../lib/api';
import type { AchievementItem } from './types';

export function useAchievementsPublicList(category?: string) {
  return useQuery({
    queryKey: ['achievements', 'public', category ?? 'all'],
    queryFn: async () => {
      const qs = category ? `?category=${encodeURIComponent(category)}` : '';
      return (await apiRequest<AchievementItem[]>(`/achievements${qs}`)).data;
    },
  });
}

export function useAchievementsAdminList(params?: {
  status?: string;
  category?: string;
  q?: string;
}) {
  return useQuery({
    queryKey: ['achievements', 'admin', params ?? {}],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (params?.status) sp.set('status', params.status);
      if (params?.category) sp.set('category', params.category);
      if (params?.q) sp.set('q', params.q);
      const qs = sp.toString() ? `?${sp.toString()}` : '';
      return (await apiRequest<AchievementItem[]>(`/admin/achievements${qs}`)).data;
    },
  });
}

export function useAchievementItem(id?: string) {
  return useQuery({
    queryKey: ['achievements', 'admin', id],
    enabled: Boolean(id),
    queryFn: async () => (await apiRequest<AchievementItem>(`/admin/achievements/${id}`)).data,
  });
}

export function useCreateAchievement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: AchievementInput) =>
      (
        await apiRequest<AchievementItem>('/admin/achievements', {
          method: 'POST',
          body: JSON.stringify(input),
        })
      ).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['achievements'] });
      void qc.invalidateQueries({ queryKey: ['public', 'achievements'] });
    },
  });
}

export function useUpdateAchievement(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: AchievementUpdate) =>
      (
        await apiRequest<AchievementItem>(`/admin/achievements/${id}`, {
          method: 'PUT',
          body: JSON.stringify(input),
        })
      ).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['achievements'] });
      void qc.invalidateQueries({ queryKey: ['public', 'achievements'] });
    },
  });
}

export function useDeleteAchievement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      (
        await apiRequest<{ deleted: boolean }>(`/admin/achievements/${id}`, {
          method: 'DELETE',
        })
      ).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['achievements'] });
      void qc.invalidateQueries({ queryKey: ['public', 'achievements'] });
    },
  });
}

export function useReorderAchievements() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) =>
      (
        await apiRequest<AchievementItem[]>('/admin/achievements/reorder', {
          method: 'PATCH',
          body: JSON.stringify({ ids }),
        })
      ).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['achievements'] });
      void qc.invalidateQueries({ queryKey: ['public', 'achievements'] });
    },
  });
}
