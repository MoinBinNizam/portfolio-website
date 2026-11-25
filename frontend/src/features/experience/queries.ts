import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ExperienceInput, ExperienceUpdate } from '@portfolio/shared';
import { apiRequest } from '../../lib/api';
import type { ExperienceItem } from './types';

export function useExperiencePublicList() {
  return useQuery({
    queryKey: ['experience', 'public'],
    queryFn: async () => (await apiRequest<ExperienceItem[]>('/experience')).data,
  });
}

export function useExperienceAdminList(params?: { status?: string; q?: string }) {
  return useQuery({
    queryKey: ['experience', 'admin', params ?? {}],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (params?.status) sp.set('status', params.status);
      if (params?.q) sp.set('q', params.q);
      const qs = sp.toString() ? `?${sp.toString()}` : '';
      return (await apiRequest<ExperienceItem[]>(`/admin/experience${qs}`)).data;
    },
  });
}

export function useExperienceItem(id?: string) {
  return useQuery({
    queryKey: ['experience', 'admin', id],
    enabled: Boolean(id),
    queryFn: async () => (await apiRequest<ExperienceItem>(`/admin/experience/${id}`)).data,
  });
}

export function useCreateExperience() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ExperienceInput) =>
      (
        await apiRequest<ExperienceItem>('/admin/experience', {
          method: 'POST',
          body: JSON.stringify(input),
        })
      ).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['experience'] });
      void qc.invalidateQueries({ queryKey: ['public', 'experience'] });
    },
  });
}

export function useUpdateExperience(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ExperienceUpdate) =>
      (
        await apiRequest<ExperienceItem>(`/admin/experience/${id}`, {
          method: 'PUT',
          body: JSON.stringify(input),
        })
      ).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['experience'] });
      void qc.invalidateQueries({ queryKey: ['public', 'experience'] });
    },
  });
}

export function useDeleteExperience() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      (
        await apiRequest<{ deleted: boolean }>(`/admin/experience/${id}`, {
          method: 'DELETE',
        })
      ).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['experience'] });
      void qc.invalidateQueries({ queryKey: ['public', 'experience'] });
    },
  });
}

export function useReorderExperience() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) =>
      (
        await apiRequest<ExperienceItem[]>('/admin/experience/reorder', {
          method: 'PATCH',
          body: JSON.stringify({ ids }),
        })
      ).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['experience'] });
      void qc.invalidateQueries({ queryKey: ['public', 'experience'] });
    },
  });
}
