const PROJECT_CATEGORY_LABELS: Record<string, string> = {
  fullstack: 'Full-Stack',
  frontend: 'Frontend',
  backend: 'Backend',
  wordpress: 'WordPress',
  marketing: 'Marketing',
};

const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  'full-time': 'Full-Time',
  'part-time': 'Part-Time',
  contract: 'Contract',
  freelance: 'Freelance',
  internship: 'Internship',
};

const ACHIEVEMENT_CATEGORY_LABELS: Record<string, string> = {
  award: 'Award',
  competition: 'Competition',
  publication: 'Publication',
  speaking: 'Speaking',
  other: 'Training & Mentoring',
};

export function formatProjectCategory(category: string): string {
  return PROJECT_CATEGORY_LABELS[category] ?? category;
}

export function formatEmploymentType(type?: string | null): string | undefined {
  if (!type) return undefined;
  return EMPLOYMENT_TYPE_LABELS[type] ?? type;
}

export function formatAchievementCategory(category: string): string {
  return ACHIEVEMENT_CATEGORY_LABELS[category] ?? category;
}
