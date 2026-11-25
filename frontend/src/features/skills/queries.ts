import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { SkillInput, SkillUpdate } from '@portfolio/shared';
import { apiRequest } from '../../lib/api';
import type { SkillItem } from './types';

export function useSkillsPublicList() {
  return useQuery({
    queryKey: ['skills', 'public'],
    queryFn: async () => (await apiRequest<SkillItem[]>('/skills')).data,
  });
}

export function useSkillsAdminList(params?: { status?: string; category?: string; q?: string }) {
  return useQuery({
    queryKey: ['skills', 'admin', params ?? {}],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (params?.status) sp.set('status', params.status);
      if (params?.category) sp.set('category', params.category);
      if (params?.q) sp.set('q', params.q);
      const qs = sp.toString() ? `?${sp.toString()}` : '';
      return (await apiRequest<SkillItem[]>(`/admin/skills${qs}`)).data;
    },
  });
}

export function useSkillItem(id?: string) {
  return useQuery({
    queryKey: ['skills', 'admin', id],
    enabled: Boolean(id),
    queryFn: async () => (await apiRequest<SkillItem>(`/admin/skills/${id}`)).data,
  });
}

export function useCreateSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: SkillInput) =>
      (
        await apiRequest<SkillItem>('/admin/skills', {
          method: 'POST',
          body: JSON.stringify(input),
        })
      ).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['skills'] });
      void qc.invalidateQueries({ queryKey: ['public', 'skills'] });
    },
  });
}

export function useUpdateSkill(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: SkillUpdate) =>
      (
        await apiRequest<SkillItem>(`/admin/skills/${id}`, {
          method: 'PUT',
          body: JSON.stringify(input),
        })
      ).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['skills'] });
      void qc.invalidateQueries({ queryKey: ['public', 'skills'] });
    },
  });
}

export function useDeleteSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      (
        await apiRequest<{ deleted: boolean }>(`/admin/skills/${id}`, {
          method: 'DELETE',
        })
      ).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['skills'] });
      void qc.invalidateQueries({ queryKey: ['public', 'skills'] });
    },
  });
}

export function useReorderSkills() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) =>
      (
        await apiRequest<SkillItem[]>('/admin/skills/reorder', {
          method: 'PATCH',
          body: JSON.stringify({ ids }),
        })
      ).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['skills'] });
      void qc.invalidateQueries({ queryKey: ['public', 'skills'] });
    },
  });
}
