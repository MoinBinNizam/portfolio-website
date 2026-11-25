import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PaginationMeta, PostInput, PostUpdate } from '@portfolio/shared';
import { apiRequest } from '../../lib/api';
import type { PostItem } from './types';

export function useBlogPublicList(params?: {
  page?: number;
  limit?: number;
  tag?: string;
  q?: string;
}) {
  return useQuery({
    queryKey: ['blog', 'public', params ?? {}],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (params?.page) sp.set('page', String(params.page));
      if (params?.limit) sp.set('limit', String(params.limit));
      if (params?.tag) sp.set('tag', params.tag);
      if (params?.q) sp.set('q', params.q);
      const qs = sp.toString() ? `?${sp.toString()}` : '';
      return apiRequest<PostItem[], PaginationMeta>(`/blog${qs}`);
    },
  });
}

export function useBlogTags() {
  return useQuery({
    queryKey: ['blog', 'tags'],
    queryFn: async () => (await apiRequest<string[]>('/blog/tags')).data,
  });
}

export function useBlogPostBySlug(slug?: string) {
  return useQuery({
    queryKey: ['blog', 'public', 'slug', slug],
    enabled: Boolean(slug),
    queryFn: async () => (await apiRequest<PostItem>(`/blog/${slug}`)).data,
  });
}

export function useBlogAdminList(params?: { status?: string; q?: string }) {
  return useQuery({
    queryKey: ['blog', 'admin', params ?? {}],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (params?.status) sp.set('status', params.status);
      if (params?.q) sp.set('q', params.q);
      const qs = sp.toString() ? `?${sp.toString()}` : '';
      return (await apiRequest<PostItem[]>(`/admin/blog${qs}`)).data;
    },
  });
}

export function useBlogPostItem(id?: string) {
  return useQuery({
    queryKey: ['blog', 'admin', id],
    enabled: Boolean(id),
    queryFn: async () => (await apiRequest<PostItem>(`/admin/blog/${id}`)).data,
  });
}

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: PostInput) =>
      (
        await apiRequest<PostItem>('/admin/blog', {
          method: 'POST',
          body: JSON.stringify(input),
        })
      ).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['blog'] });
      void qc.invalidateQueries({ queryKey: ['public', 'blog'] });
    },
  });
}

export function useUpdatePost(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: PostUpdate) =>
      (
        await apiRequest<PostItem>(`/admin/blog/${id}`, {
          method: 'PUT',
          body: JSON.stringify(input),
        })
      ).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['blog'] });
      void qc.invalidateQueries({ queryKey: ['public', 'blog'] });
    },
  });
}

export function usePublishPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      (await apiRequest<PostItem>(`/admin/blog/${id}/publish`, { method: 'POST' })).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['blog'] });
      void qc.invalidateQueries({ queryKey: ['public', 'blog'] });
    },
  });
}

export function useUnpublishPost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      (await apiRequest<PostItem>(`/admin/blog/${id}/unpublish`, { method: 'POST' })).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['blog'] });
      void qc.invalidateQueries({ queryKey: ['public', 'blog'] });
    },
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      (
        await apiRequest<{ deleted: boolean }>(`/admin/blog/${id}`, {
          method: 'DELETE',
        })
      ).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['blog'] });
      void qc.invalidateQueries({ queryKey: ['public', 'blog'] });
    },
  });
}
