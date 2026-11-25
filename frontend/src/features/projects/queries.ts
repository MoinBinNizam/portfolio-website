import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ProjectInput, ProjectUpdate } from '@portfolio/shared';
import { apiRequest } from '../../lib/api';
import type { ProjectItem } from './types';

export function useProjectsPublicList(params?: {
  category?: string;
  featured?: boolean;
  q?: string;
}) {
  return useQuery({
    queryKey: ['projects', 'public', params ?? {}],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (params?.category) sp.set('category', params.category);
      if (params?.featured) sp.set('featured', 'true');
      if (params?.q) sp.set('q', params.q);
      const qs = sp.toString() ? `?${sp.toString()}` : '';
      return (await apiRequest<ProjectItem[]>(`/projects${qs}`)).data;
    },
  });
}

export function useProjectBySlug(slug?: string) {
  return useQuery({
    queryKey: ['projects', 'public', 'slug', slug],
    enabled: Boolean(slug),
    queryFn: async () => (await apiRequest<ProjectItem>(`/projects/${slug}`)).data,
  });
}

export function useProjectsAdminList(params?: { status?: string; category?: string; q?: string }) {
  return useQuery({
    queryKey: ['projects', 'admin', params ?? {}],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (params?.status) sp.set('status', params.status);
      if (params?.category) sp.set('category', params.category);
      if (params?.q) sp.set('q', params.q);
      const qs = sp.toString() ? `?${sp.toString()}` : '';
      return (await apiRequest<ProjectItem[]>(`/admin/projects${qs}`)).data;
    },
  });
}

export function useProjectItem(id?: string) {
  return useQuery({
    queryKey: ['projects', 'admin', id],
    enabled: Boolean(id),
    queryFn: async () => (await apiRequest<ProjectItem>(`/admin/projects/${id}`)).data,
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ProjectInput) =>
      (
        await apiRequest<ProjectItem>('/admin/projects', {
          method: 'POST',
          body: JSON.stringify(input),
        })
      ).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['projects'] });
      void qc.invalidateQueries({ queryKey: ['public', 'projects'] });
    },
  });
}

export function useUpdateProject(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: ProjectUpdate) =>
      (
        await apiRequest<ProjectItem>(`/admin/projects/${id}`, {
          method: 'PUT',
          body: JSON.stringify(input),
        })
      ).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['projects'] });
      void qc.invalidateQueries({ queryKey: ['public', 'projects'] });
    },
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      (
        await apiRequest<{ deleted: boolean }>(`/admin/projects/${id}`, {
          method: 'DELETE',
        })
      ).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['projects'] });
      void qc.invalidateQueries({ queryKey: ['public', 'projects'] });
    },
  });
}

export function useReorderProjects() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (ids: string[]) =>
      (
        await apiRequest<ProjectItem[]>('/admin/projects/reorder', {
          method: 'PATCH',
          body: JSON.stringify({ ids }),
        })
      ).data,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['projects'] });
      void qc.invalidateQueries({ queryKey: ['public', 'projects'] });
    },
  });
}
