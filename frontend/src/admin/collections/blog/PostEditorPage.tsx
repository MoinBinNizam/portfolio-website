import { zodResolver } from '@hookform/resolvers/zod';
import { PostInputSchema, type PostInput } from '@portfolio/shared';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Textarea } from '../../../components/ui/Textarea';
import { useToast } from '../../../components/ui/Toast';
import { useBlogPostItem, useCreatePost, useUpdatePost } from '../../../features/blog/queries';
import { FormField } from '../../../forms/FormField';
import { ImageField } from '../../../forms/ImageField';
import { MarkdownField } from '../../../forms/MarkdownField';
import { TagsField } from '../../../forms/TagsField';
import { AdminShell } from '../../AdminShell';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function PostEditorPage() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const { notify } = useToast();

  const { data: existing, isLoading } = useBlogPostItem(isNew ? undefined : id);
  const createMutation = useCreatePost();
  const updateMutation = useUpdatePost(id ?? '');

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PostInput>({
    resolver: zodResolver(PostInputSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      body: '',
      coverImage: null,
      tags: [],
      category: 'Engineering',
      status: 'draft',
      seo: { metaTitle: '', metaDescription: '', ogImage: null },
      featured: false,
    },
  });

  useEffect(() => {
    if (existing) {
      reset({
        ...existing,
        seo: {
          metaTitle: existing.seo?.metaTitle ?? '',
          metaDescription: existing.seo?.metaDescription ?? '',
          ogImage: existing.seo?.ogImage ?? null,
        },
      });
    }
  }, [existing, reset]);

  const titleValue = watch('title');

  const onSubmit = async (values: PostInput) => {
    try {
      if (isNew) {
        await createMutation.mutateAsync(values);
        notify('Post created', 'success');
      } else {
        await updateMutation.mutateAsync(values);
        notify('Post updated', 'success');
      }
      navigate('/admin/blog');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Save failed', 'error');
    }
  };

  return (
    <AdminShell title={isNew ? 'New Post' : 'Edit Post'}>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-textPrimary">
          {isNew ? 'New blog post' : 'Edit blog post'}
        </h1>
        <Link
          to="/admin/blog"
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
            <FormField id="title" label="Post Title" required error={errors.title?.message}>
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
            <FormField id="category" label="Category" required error={errors.category?.message}>
              <Input id="category" {...register('category')} error={errors.category?.message} />
            </FormField>
            <FormField id="status" label="Status" error={errors.status?.message}>
              <Select id="status" {...register('status')}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </Select>
            </FormField>
          </div>

          <FormField
            id="excerpt"
            label="Excerpt (max 240 chars)"
            required
            error={errors.excerpt?.message}
          >
            <Textarea
              id="excerpt"
              rows={2}
              {...register('excerpt')}
              error={errors.excerpt?.message}
            />
          </FormField>

          <Controller
            control={control}
            name="body"
            render={({ field }) => (
              <MarkdownField
                id="body"
                label="Article Body (Markdown)"
                required
                value={field.value}
                onChange={field.onChange}
                error={errors.body?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="tags"
            render={({ field }) => (
              <TagsField
                id="tags"
                label="Tags"
                value={field.value}
                onChange={field.onChange}
                placeholder="Add tag and press Enter"
                error={errors.tags?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="coverImage"
            render={({ field }) => (
              <ImageField
                id="coverImage"
                label="Cover Image"
                value={field.value}
                onChange={field.onChange}
                error={errors.coverImage?.message}
              />
            )}
          />

          <div className="space-y-4 rounded-card border border-border bg-surface p-5">
            <h2 className="text-base font-semibold text-textPrimary">SEO Metadata</h2>
            <FormField
              id="seo-title"
              label="Meta Title (max 70 chars)"
              error={errors.seo?.metaTitle?.message}
            >
              <Input id="seo-title" {...register('seo.metaTitle')} />
            </FormField>
            <FormField
              id="seo-desc"
              label="Meta Description (max 160 chars)"
              error={errors.seo?.metaDescription?.message}
            >
              <Textarea id="seo-desc" rows={2} {...register('seo.metaDescription')} />
            </FormField>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save post'}
          </Button>
        </form>
      )}
    </AdminShell>
  );
}
