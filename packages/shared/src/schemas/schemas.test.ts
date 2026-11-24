import { describe, expect, it } from 'vitest';
import {
  CertificationInputSchema,
  ContactInputSchema,
  EducationInputSchema,
  ExperienceInputSchema,
  ProjectInputSchema,
} from '../index.js';

describe('Shared Zod schemas', () => {
  it('rejects experience when endDate is before startDate', () => {
    const result = ExperienceInputSchema.safeParse({
      company: 'TechVelly',
      role: 'Full-Stack Developer',
      startDate: '2024-06-01T00:00:00.000Z',
      endDate: '2024-01-01T00:00:00.000Z',
      isCurrent: false,
    });
    expect(result.success).toBe(false);
  });

  it('rejects education when endYear is before startYear', () => {
    const result = EducationInputSchema.safeParse({
      institution: 'Example University',
      degree: 'BSc',
      field: 'Computer Science',
      startYear: 2022,
      endYear: 2020,
    });
    expect(result.success).toBe(false);
  });

  it('rejects certification when expiryDate is on or before issueDate', () => {
    const result = CertificationInputSchema.safeParse({
      title: 'AWS Developer',
      issuer: 'Amazon',
      issueDate: '2025-01-01T00:00:00.000Z',
      expiryDate: '2025-01-01T00:00:00.000Z',
    });
    expect(result.success).toBe(false);
  });

  it('rejects project with invalid slug', () => {
    const result = ProjectInputSchema.safeParse({
      slug: 'Invalid Slug!',
      title: 'Portfolio',
      summary: 'A full-stack portfolio built with MERN and TypeScript.',
      description: 'Detailed description of the portfolio project.',
    });
    expect(result.success).toBe(false);
  });

  it('rejects contact message when honeypot is filled', () => {
    const result = ContactInputSchema.safeParse({
      name: 'Visitor',
      email: 'visitor@example.com',
      message: 'Hello, I would like to discuss a project.',
      honeypot: 'bot-filled',
    });
    expect(result.success).toBe(false);
  });
});
