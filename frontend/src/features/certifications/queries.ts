import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CertificationInput, CertificationUpdate } from '@portfolio/shared';
import { apiRequest } from '../../lib/api';
import type { CertificationItem } from './types';

export function useCertificationsPublicList() {
  return useQuery({
    queryKey: ['certifications', 'public'],
    queryFn: async () => (await apiRequest<CertificationItem[]>('/certifications')).data,
  });
}

export function useCertificationsAdminList(params?: { status?: string; q?: string }) {
  return useQuery({
    queryKey: ['certifications', 'admin', params ?? {}],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (params?.status) sp.set('status', params.status);
      if (params?.q) sp.set('q', params.q);
      const qs = sp.toString() ? `?${sp.toString()}` : '';
      return (await apiRequest<CertificationItem[]>(`/admin/certifications${qs}`)).data;
    },
  });
}

export function useCertificationItem(id?: string) {
  return useQuery({
    queryKey: ['certifications', 'admin', id],
    enabled: Boolean(id),
    queryFn: async () => (await apiRequest<CertificationItem>(`/admin/certifications/${id}`)).data,
  });
}

export function useCreateCertification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CertificationInput) =>
      (
        await apiRequest<CertificationItem>('/admin/certifications', {
          method: 'POST',
          body: JSON.stringify(input),
        })
      ).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['certifications'] });
      void qc.invalidateQueries({ queryKey: ['public', 'certifications'] });
    },
  });
}

export function useUpdateCertification(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CertificationUpdate) =>
      (
        await apiRequest<CertificationItem>(`/admin/certifications/${id}`, {
          method: 'PUT',
          body: JSON.stringify(input),
        })
      ).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['certifications'] });
      void qc.invalidateQueries({ queryKey: ['public', 'certifications'] });
    },
  });
}

export function useDeleteCertification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      (
        await apiRequest<{ deleted: boolean }>(`/admin/certifications/${id}`, {
          method: 'DELETE',
        })
      ).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['certifications'] });
      void qc.invalidateQueries({ queryKey: ['public', 'certifications'] });
    },
  });
}

export function useReorderCertifications() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) =>
      (
        await apiRequest<CertificationItem[]>('/admin/certifications/reorder', {
          method: 'PATCH',
          body: JSON.stringify({ ids }),
        })
      ).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['certifications'] });
      void qc.invalidateQueries({ queryKey: ['public', 'certifications'] });
    },
  });
}
