import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { TestimonialInput, TestimonialUpdate } from '@portfolio/shared';
import { apiRequest } from '../../lib/api';
import type { TestimonialItem } from './types';

export function useTestimonialsAdminList(params?: { status?: string; q?: string }) {
  return useQuery({
    queryKey: ['testimonials', 'admin', params ?? {}],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (params?.status) sp.set('status', params.status);
      if (params?.q) sp.set('q', params.q);
      const qs = sp.toString() ? `?${sp.toString()}` : '';
      return (await apiRequest<TestimonialItem[]>(`/admin/testimonials${qs}`)).data;
    },
  });
}

export function useTestimonialItem(id?: string) {
  return useQuery({
    queryKey: ['testimonials', 'admin', id],
    enabled: Boolean(id),
    queryFn: async () => (await apiRequest<TestimonialItem>(`/admin/testimonials/${id}`)).data,
  });
}

export function useCreateTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: TestimonialInput) =>
      (
        await apiRequest<TestimonialItem>('/admin/testimonials', {
          method: 'POST',
          body: JSON.stringify(input),
        })
      ).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['testimonials'] });
      void qc.invalidateQueries({ queryKey: ['public', 'testimonials'] });
    },
  });
}

export function useUpdateTestimonial(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: TestimonialUpdate) =>
      (
        await apiRequest<TestimonialItem>(`/admin/testimonials/${id}`, {
          method: 'PUT',
          body: JSON.stringify(input),
        })
      ).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['testimonials'] });
      void qc.invalidateQueries({ queryKey: ['public', 'testimonials'] });
    },
  });
}

export function useDeleteTestimonial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      (
        await apiRequest<{ deleted: boolean }>(`/admin/testimonials/${id}`, {
          method: 'DELETE',
        })
      ).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['testimonials'] });
      void qc.invalidateQueries({ queryKey: ['public', 'testimonials'] });
    },
  });
}

export function useReorderTestimonials() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) =>
      (
        await apiRequest<TestimonialItem[]>('/admin/testimonials/reorder', {
          method: 'PATCH',
          body: JSON.stringify({ ids }),
        })
      ).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['testimonials'] });
      void qc.invalidateQueries({ queryKey: ['public', 'testimonials'] });
    },
  });
}
