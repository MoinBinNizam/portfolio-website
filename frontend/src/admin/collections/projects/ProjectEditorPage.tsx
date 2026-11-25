import { zodResolver } from '@hookform/resolvers/zod';
import { ProjectInputSchema, type ContentStatus, type ProjectInput } from '@portfolio/shared';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Textarea } from '../../../components/ui/Textarea';
import { useToast } from '../../../components/ui/Toast';
import {
  useCreateProject,
  useProjectItem,
  useUpdateProject,
} from '../../../features/projects/queries';
import { FormField } from '../../../forms/FormField';
import { GalleryField } from '../../../forms/GalleryField';
import { ImageField } from '../../../forms/ImageField';
import { StatusField } from '../../../forms/StatusField';
import { TagsField } from '../../../forms/TagsField';
import { MarkdownBody } from '../../../lib/markdown';
import { AdminShell } from '../../AdminShell';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function ProjectEditorPage() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const { notify } = useToast();
  const [caseStudyTab, setCaseStudyTab] = useState<'write' | 'preview'>('write');

  const { data: existing, isLoading } = useProjectItem(isNew ? undefined : id);
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject(id ?? '');

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProjectInput>({
    resolver: zodResolver(ProjectInputSchema),
    defaultValues: {
      slug: '',
      title: '',
      summary: '',
      category: 'fullstack',
      description: '',
      caseStudy: '',
      cover: null,
      gallery: [],
      techStack: [],
      liveUrl: '',
      repoUrl: '',
      featured: false,
      order: 0,
      status: 'draft',
    },
  });

  useEffect(() => {
    if (existing) {
      reset({
        ...existing,
        liveUrl: existing.liveUrl ?? '',
        repoUrl: existing.repoUrl ?? '',
        gallery: existing.gallery ?? [],
      });
    }
  }, [existing, reset]);

  const titleValue = watch('title');
  const caseStudyValue = watch('caseStudy') ?? '';

  const insertCaseStudyTemplate = () => {
    const template = [
      '## Problem',
      'Describe the business problem and constraints.',
      '',
      '## Architecture & Solution',
      '- Key technical decisions and stack highlights.',
      '- Security, validation, and performance measures.',
      '',
      '## Impact & Results',
      '- Measurable outcome or client benefit.',
    ].join('\n');
    const next = caseStudyValue.trim() ? `${caseStudyValue.trim()}\n\n${template}` : template;
    setValue('caseStudy', next, { shouldDirty: true, shouldValidate: true });
    setCaseStudyTab('write');
  };

  const onSubmit = async (values: ProjectInput) => {
    try {
      if (isNew) {
        await createMutation.mutateAsync(values);
        notify('Project created', 'success');
      } else {
        await updateMutation.mutateAsync(values);
        notify('Project updated', 'success');
      }
      navigate('/admin/projects');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Save failed', 'error');
    }
  };

  return (
    <AdminShell title={isNew ? 'New Project' : 'Edit Project'}>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-textPrimary">
          {isNew ? 'New project' : 'Edit project'}
        </h1>
        <Link
          to="/admin/projects"
          className="text-sm font-medium text-textMuted hover:text-textPrimary"
        >
          &larr; Back to list
        </Link>
      </div>

      {!isNew && isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="title" label="Project Title" required error={errors.title?.message}>
              <Input id="title" {...register('title')} error={errors.title?.message} />
            </FormField>
            <FormField id="slug" label="URL Slug" required error={errors.slug?.message}>
              <div className="flex gap-2">
                <Input id="slug" {...register('slug')} error={errors.slug?.message} />
                <button
                  type="button"
                  onClick={() => setValue('slug', slugify(titleValue), { shouldValidate: true })}
                  className="shrink-0 rounded-button border border-border bg-surface px-3 py-2 text-xs font-medium text-textPrimary hover:border-accent"
                >
                  Generate
                </button>
              </div>
            </FormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="category" label="Category" error={errors.category?.message}>
              <Select id="category" {...register('category')}>
                <option value="fullstack">Fullstack</option>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="wordpress">WordPress</option>
                <option value="marketing">Marketing</option>
              </Select>
            </FormField>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm text-textPrimary">
                <input
                  type="checkbox"
                  {...register('featured')}
                  className="h-4 w-4 accent-accent"
                />
                <span>Featured on home page</span>
              </label>
            </div>
          </div>

          <FormField id="summary" label="Short Summary" required error={errors.summary?.message}>
            <Textarea
              id="summary"
              rows={2}
              {...register('summary')}
              error={errors.summary?.message}
            />
          </FormField>

          <FormField
            id="description"
            label="Overview Description (Markdown)"
            required
            error={errors.description?.message}
          >
            <Textarea
              id="description"
              rows={4}
              {...register('description')}
              error={errors.description?.message}
            />
          </FormField>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label htmlFor="caseStudy" className="text-sm font-medium text-textPrimary">
                Case Study (Markdown)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={insertCaseStudyTemplate}
                  className="rounded-button border border-border bg-surface px-2.5 py-1 text-xs font-medium text-textMuted hover:border-accent hover:text-accent"
                >
                  + Insert template
                </button>
                <div className="inline-flex rounded-button border border-border bg-surface p-0.5">
                  <button
                    type="button"
                    onClick={() => setCaseStudyTab('write')}
                    className={`rounded-button px-3 py-1 text-xs font-medium ${
                      caseStudyTab === 'write'
                        ? 'bg-accent text-accentText'
                        : 'text-textMuted hover:text-textPrimary'
                    }`}
                  >
                    Write
                  </button>
                  <button
                    type="button"
                    onClick={() => setCaseStudyTab('preview')}
                    className={`rounded-button px-3 py-1 text-xs font-medium ${
                      caseStudyTab === 'preview'
                        ? 'bg-accent text-accentText'
                        : 'text-textMuted hover:text-textPrimary'
                    }`}
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>

            {caseStudyTab === 'write' ? (
              <FormField
                id="caseStudy"
                label=""
                hint="Supports ## headings, **bold**, `code`, bullet lists (- ), and [links](https://...)."
                error={errors.caseStudy?.message}
              >
                <Textarea
                  id="caseStudy"
                  rows={10}
                  placeholder="Write the full project case study in Markdown..."
                  {...register('caseStudy')}
                  error={errors.caseStudy?.message}
                />
              </FormField>
            ) : (
              <div className="min-h-[14rem] rounded-card border border-border bg-surface p-5">
                {caseStudyValue.trim() ? (
                  <MarkdownBody content={caseStudyValue} />
                ) : (
                  <p className="text-sm text-textMuted">
                    Nothing to preview yet. Switch to Write or click &ldquo;+ Insert
                    template&rdquo;.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="liveUrl" label="Live Demo URL" error={errors.liveUrl?.message}>
              <Input
                id="liveUrl"
                type="url"
                placeholder="https://..."
                {...register('liveUrl')}
                error={errors.liveUrl?.message}
              />
            </FormField>
            <FormField id="repoUrl" label="Repository URL" error={errors.repoUrl?.message}>
              <Input
                id="repoUrl"
                type="url"
                placeholder="https://github.com/..."
                {...register('repoUrl')}
                error={errors.repoUrl?.message}
              />
            </FormField>
          </div>

          <Controller
            control={control}
            name="techStack"
            render={({ field }) => (
              <TagsField
                id="techStack"
                label="Tech Stack"
                value={field.value}
                onChange={field.onChange}
                placeholder="Add technology and press Enter"
                error={errors.techStack?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="cover"
            render={({ field }) => (
              <ImageField
                id="cover"
                label="Featured Photo (Home &amp; Projects Card)"
                value={field.value}
                onChange={field.onChange}
                error={errors.cover?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="gallery"
            render={({ field }) => (
              <GalleryField
                id="gallery"
                label="Project Gallery Screenshots"
                value={field.value}
                onChange={field.onChange}
                error={errors.gallery?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <StatusField
                value={field.value as ContentStatus}
                onChange={field.onChange}
                error={errors.status?.message}
              />
            )}
          />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save project'}
          </Button>
        </form>
      )}
    </AdminShell>
  );
}
