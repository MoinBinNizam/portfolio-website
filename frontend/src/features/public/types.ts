import type {
  AchievementInput,
  CertificationInput,
  EducationInput,
  ExperienceInput,
  PostInput,
  ProfileInput,
  ProjectInput,
  ServiceInput,
  SkillInput,
  TestimonialInput,
} from '@portfolio/shared';

export interface WithId {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ProfileItem = ProfileInput & WithId;
export type ExperienceItem = ExperienceInput & WithId;
export type EducationItem = EducationInput & WithId;
export type CertificationItem = CertificationInput & WithId;
export type AchievementItem = AchievementInput & WithId;
export type ProjectItem = ProjectInput & WithId;
export type SkillItem = SkillInput & WithId;
export type ServiceItem = ServiceInput & WithId;
export type TestimonialItem = TestimonialInput & WithId;
export type PostItem = PostInput & WithId & { readingTime?: number };
