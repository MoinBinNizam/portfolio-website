import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { EducationInput, EducationUpdate } from '@portfolio/shared';
import { apiRequest } from '../../lib/api';
import type { EducationItem } from './types';

export function useEducationPublicList() {
  return useQuery({
    queryKey: ['education', 'public'],
    queryFn: async () => (await apiRequest<EducationItem[]>('/education')).data,
  });
}

export function useEducationAdminList(params?: { status?: string; q?: string }) {
  return useQuery({
    queryKey: ['education', 'admin', params ?? {}],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (params?.status) sp.set('status', params.status);
      if (params?.q) sp.set('q', params.q);
      const qs = sp.toString() ? `?${sp.toString()}` : '';
      return (await apiRequest<EducationItem[]>(`/admin/education${qs}`)).data;
    },
  });
}

export function useEducationItem(id?: string) {
  return useQuery({
    queryKey: ['education', 'admin', id],
    enabled: Boolean(id),
    queryFn: async () => (await apiRequest<EducationItem>(`/admin/education/${id}`)).data,
  });
}

export function useCreateEducation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: EducationInput) =>
      (
        await apiRequest<EducationItem>('/admin/education', {
          method: 'POST',
          body: JSON.stringify(input),
        })
      ).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['education'] });
      void qc.invalidateQueries({ queryKey: ['public', 'education'] });
    },
  });
}

export function useUpdateEducation(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: EducationUpdate) =>
      (
        await apiRequest<EducationItem>(`/admin/education/${id}`, {
          method: 'PUT',
          body: JSON.stringify(input),
        })
      ).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['education'] });
      void qc.invalidateQueries({ queryKey: ['public', 'education'] });
    },
  });
}

export function useDeleteEducation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      (
        await apiRequest<{ deleted: boolean }>(`/admin/education/${id}`, {
          method: 'DELETE',
        })
      ).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['education'] });
      void qc.invalidateQueries({ queryKey: ['public', 'education'] });
    },
  });
}

export function useReorderEducation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) =>
      (
        await apiRequest<EducationItem[]>('/admin/education/reorder', {
          method: 'PATCH',
          body: JSON.stringify({ ids }),
        })
      ).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['education'] });
      void qc.invalidateQueries({ queryKey: ['public', 'education'] });
    },
  });
}
