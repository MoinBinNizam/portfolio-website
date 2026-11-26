import { createContext, createElement, useContext, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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

interface HomeBootstrapPayload {
  profile: ProfileItem | null;
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  achievements: AchievementItem[];
  projects: ProjectItem[];
  skills: SkillItem[];
  services: ServiceItem[];
  testimonials: TestimonialItem[];
  posts: {
    data: PostItem[];
    meta: PaginationMeta;
  };
}

const HomeBootstrapContext = createContext(false);

export function HomeBootstrapProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { isLoading } = useQuery({
    queryKey: ['public', 'home'],
    queryFn: async () => {
      const res = await apiRequest<HomeBootstrapPayload>('/home');
      const d = res.data;
      queryClient.setQueryData(['public', 'profile'], d.profile);
      queryClient.setQueryData(['public', 'experience'], d.experience);
      queryClient.setQueryData(['public', 'education'], d.education);
      queryClient.setQueryData(['public', 'certifications'], d.certifications);
      queryClient.setQueryData(['public', 'achievements', 'all'], d.achievements);
      queryClient.setQueryData(['public', 'projects', {}], d.projects);
      queryClient.setQueryData(
        ['public', 'projects', { featured: true }],
        d.projects.filter((p) => p.featured),
      );
      queryClient.setQueryData(['public', 'skills'], d.skills);
      queryClient.setQueryData(['public', 'services'], d.services);
      queryClient.setQueryData(['public', 'testimonials'], d.testimonials);
      queryClient.setQueryData(['public', 'blog', { page: 1, limit: 3 }], {
        data: d.posts.data,
        meta: d.posts.meta,
      });
      return d;
    },
  });

  return createElement(HomeBootstrapContext.Provider, { value: isLoading }, children);
}

export function usePublicProfile() {
  const isBootstrapping = useContext(HomeBootstrapContext);
  return useQuery({
    queryKey: ['public', 'profile'],
    queryFn: async () => (await apiRequest<ProfileItem | null>('/profile')).data,
    enabled: !isBootstrapping,
  });
}

export function usePublicExperience() {
  const isBootstrapping = useContext(HomeBootstrapContext);
  return useQuery({
    queryKey: ['public', 'experience'],
    queryFn: async () => (await apiRequest<ExperienceItem[]>('/experience')).data,
    enabled: !isBootstrapping,
  });
}

export function usePublicEducation() {
  const isBootstrapping = useContext(HomeBootstrapContext);
  return useQuery({
    queryKey: ['public', 'education'],
    queryFn: async () => (await apiRequest<EducationItem[]>('/education')).data,
    enabled: !isBootstrapping,
  });
}

export function usePublicCertifications() {
  const isBootstrapping = useContext(HomeBootstrapContext);
  return useQuery({
    queryKey: ['public', 'certifications'],
    queryFn: async () => (await apiRequest<CertificationItem[]>('/certifications')).data,
    enabled: !isBootstrapping,
  });
}

export function usePublicAchievements(category?: string) {
  const isBootstrapping = useContext(HomeBootstrapContext);
  return useQuery({
    queryKey: ['public', 'achievements', category ?? 'all'],
    queryFn: async () => {
      const qs = category ? `?category=${encodeURIComponent(category)}` : '';
      return (await apiRequest<AchievementItem[]>(`/achievements${qs}`)).data;
    },
    enabled: !isBootstrapping,
  });
}

export function usePublicProjects(params?: { category?: string; featured?: boolean }) {
  const isBootstrapping = useContext(HomeBootstrapContext);
  return useQuery({
    queryKey: ['public', 'projects', params ?? {}],
    queryFn: async () => {
      const sp = new URLSearchParams();
      if (params?.category) sp.set('category', params.category);
      if (params?.featured) sp.set('featured', 'true');
      const qs = sp.toString() ? `?${sp.toString()}` : '';
      return (await apiRequest<ProjectItem[]>(`/projects${qs}`)).data;
    },
    enabled: !isBootstrapping,
  });
}

export function usePublicSkills() {
  const isBootstrapping = useContext(HomeBootstrapContext);
  return useQuery({
    queryKey: ['public', 'skills'],
    queryFn: async () => (await apiRequest<SkillItem[]>('/skills')).data,
    enabled: !isBootstrapping,
  });
}

export function usePublicServices() {
  const isBootstrapping = useContext(HomeBootstrapContext);
  return useQuery({
    queryKey: ['public', 'services'],
    queryFn: async () => (await apiRequest<ServiceItem[]>('/services')).data,
    enabled: !isBootstrapping,
  });
}

export function usePublicTestimonials() {
  const isBootstrapping = useContext(HomeBootstrapContext);
  return useQuery({
    queryKey: ['public', 'testimonials'],
    queryFn: async () => (await apiRequest<TestimonialItem[]>('/testimonials')).data,
    enabled: !isBootstrapping,
  });
}

export function usePublicPosts(params?: {
  page?: number;
  limit?: number;
  tag?: string;
  q?: string;
}) {
  const isBootstrapping = useContext(HomeBootstrapContext);
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
    enabled: !isBootstrapping,
  });
}
