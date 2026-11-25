import type { ExperienceItem } from '../features/public/types';

/**
 * Calculates merged non-overlapping total experience duration from experience records.
 */
export function calculateTotalExperienceDuration(items: ExperienceItem[]): string {
  if (items.length === 0) return '';
  const ranges = items
    .map((item) => {
      const start = Date.parse(item.startDate);
      const end = item.isCurrent || !item.endDate ? Date.now() : Date.parse(item.endDate);
      return Number.isNaN(start) || Number.isNaN(end)
        ? null
        : ([start, Math.max(start, end)] as const);
    })
    .filter((r): r is readonly [number, number] => r !== null)
    .sort((a, b) => a[0] - b[0]);

  if (ranges.length === 0) return '';

  const merged: Array<[number, number]> = [];
  for (const [s, e] of ranges) {
    const last = merged[merged.length - 1];
    if (!last || s > last[1]) {
      merged.push([s, e]);
    } else {
      last[1] = Math.max(last[1], e);
    }
  }

  const totalMonths = merged.reduce((acc, [s, e]) => {
    const months = (e - s) / (1000 * 60 * 60 * 24 * 30.4375);
    return acc + Math.max(1, Math.round(months));
  }, 0);

  const years = Math.floor(totalMonths / 12);
  const remMonths = totalMonths % 12;
  if (years > 0 && remMonths > 0) return `${years} yrs ${remMonths} mos`;
  if (years > 0) return `${years}+ yrs`;
  return `${remMonths} mos`;
}

/**
 * Injects the dynamic total experience duration into the opening paragraph of About Me.
 */
export function formatAboutWithExperience(about: string, duration: string): string {
  if (!duration) return about;
  const roleMatch = /\*\*Full-Stack Web Developer\*\*|Full-Stack Web Developer/i.exec(about);
  if (roleMatch) {
    return (
      about.slice(0, roleMatch.index + roleMatch[0].length) +
      ` **with ${duration} of experience**` +
      about.slice(roleMatch.index + roleMatch[0].length)
    );
  }
  return `**With ${duration} of hands-on experience,** ${about.charAt(0).toLowerCase()}${about.slice(1)}`;
}
