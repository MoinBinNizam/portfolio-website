import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ServiceInput, ServiceUpdate } from '@portfolio/shared';
import { apiRequest } from '../../lib/api';
import type { ServiceItem } from './types';

export function useServicesPublicList() {
  return useQuery({
    queryKey: ['services', 'public'],
    queryFn: async () => (await apiRequest<ServiceItem[]>('/services')).data,
  });
}

export function useServicesAdminList(params?: { status?: string; q?: string }) {
  return useQuery({
    queryKey: ['services', 'admin', params ?? {}],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (params?.status) sp.set('status', params.status);
      if (params?.q) sp.set('q', params.q);
      const qs = sp.toString() ? `?${sp.toString()}` : '';
      return (await apiRequest<ServiceItem[]>(`/admin/services${qs}`)).data;
    },
  });
}

export function useServiceItem(id?: string) {
  return useQuery({
    queryKey: ['services', 'admin', id],
    enabled: Boolean(id),
    queryFn: async () => (await apiRequest<ServiceItem>(`/admin/services/${id}`)).data,
  });
}

export function useCreateService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ServiceInput) =>
      (
        await apiRequest<ServiceItem>('/admin/services', {
          method: 'POST',
          body: JSON.stringify(input),
        })
      ).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['services'] });
      void qc.invalidateQueries({ queryKey: ['public', 'services'] });
    },
  });
}

export function useUpdateService(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ServiceUpdate) =>
      (
        await apiRequest<ServiceItem>(`/admin/services/${id}`, {
          method: 'PUT',
          body: JSON.stringify(input),
        })
      ).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['services'] });
      void qc.invalidateQueries({ queryKey: ['public', 'services'] });
    },
  });
}

export function useDeleteService() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      (
        await apiRequest<{ deleted: boolean }>(`/admin/services/${id}`, {
          method: 'DELETE',
        })
      ).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['services'] });
      void qc.invalidateQueries({ queryKey: ['public', 'services'] });
    },
  });
}

export function useReorderServices() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) =>
      (
        await apiRequest<ServiceItem[]>('/admin/services/reorder', {
          method: 'PATCH',
          body: JSON.stringify({ ids }),
        })
      ).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['services'] });
      void qc.invalidateQueries({ queryKey: ['public', 'services'] });
    },
  });
}
