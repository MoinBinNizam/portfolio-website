import { useQuery } from '@tanstack/react-query';
import type { PaginationMeta } from '@portfolio/shared';
import { apiRequest } from '../../lib/api';
import type {
  AchievementItem,
  CertificationItem,
  EducationItem,
  ExperienceItem,
  PostItem,
  ProfileItem,
  ProjectItem,
  ServiceItem,
  SkillItem,
  TestimonialItem,
} from './types';

export function usePublicProfile() {
  return useQuery({
    queryKey: ['public', 'profile'],
    queryFn: async () => (await apiRequest<ProfileItem | null>('/profile')).data,
  });
}

export function usePublicExperience() {
  return useQuery({
    queryKey: ['public', 'experience'],
    queryFn: async () => (await apiRequest<ExperienceItem[]>('/experience')).data,
  });
}

export function usePublicEducation() {
  return useQuery({
    queryKey: ['public', 'education'],
    queryFn: async () => (await apiRequest<EducationItem[]>('/education')).data,
  });
}

export function usePublicCertifications() {
  return useQuery({
    queryKey: ['public', 'certifications'],
    queryFn: async () => (await apiRequest<CertificationItem[]>('/certifications')).data,
  });
}

export function usePublicAchievements(category?: string) {
  return useQuery({
    queryKey: ['public', 'achievements', category ?? 'all'],
    queryFn: async () => {
      const qs = category ? `?category=${encodeURIComponent(category)}` : '';
      return (await apiRequest<AchievementItem[]>(`/achievements${qs}`)).data;
    },
  });
}

export function usePublicProjects(params?: { category?: string; featured?: boolean }) {
  return useQuery({
    queryKey: ['public', 'projects', params ?? {}],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (params?.category) sp.set('category', params.category);
      if (params?.featured) sp.set('featured', 'true');
      const qs = sp.toString() ? `?${sp.toString()}` : '';
      return (await apiRequest<ProjectItem[]>(`/projects${qs}`)).data;
    },
  });
}

export function usePublicSkills() {
  return useQuery({
    queryKey: ['public', 'skills'],
    queryFn: async () => (await apiRequest<SkillItem[]>('/skills')).data,
  });
}

export function usePublicServices() {
  return useQuery({
    queryKey: ['public', 'services'],
    queryFn: async () => (await apiRequest<ServiceItem[]>('/services')).data,
  });
}

export function usePublicTestimonials() {
  return useQuery({
    queryKey: ['public', 'testimonials'],
    queryFn: async () => (await apiRequest<TestimonialItem[]>('/testimonials')).data,
  });
}

export function usePublicPosts(params?: {
  page?: number;
  limit?: number;
  tag?: string;
  q?: string;
}) {
  return useQuery({
    queryKey: ['public', 'blog', params ?? {}],
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
