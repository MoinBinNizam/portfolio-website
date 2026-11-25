import { zodResolver } from '@hookform/resolvers/zod';
import {
  AchievementInputSchema,
  type AchievementInput,
  type ContentStatus,
} from '@portfolio/shared';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Textarea } from '../../../components/ui/Textarea';
import { useToast } from '../../../components/ui/Toast';
import {
  useAchievementItem,
  useCreateAchievement,
  useUpdateAchievement,
} from '../../../features/achievements/queries';
import { FormField } from '../../../forms/FormField';
import { ImageField } from '../../../forms/ImageField';
import { StatusField } from '../../../forms/StatusField';
import { AdminShell } from '../../AdminShell';

export function AchievementEditorPage() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const { notify } = useToast();

  const { data: existing, isLoading } = useAchievementItem(isNew ? undefined : id);
  const createMutation = useCreateAchievement();
  const updateMutation = useUpdateAchievement(id ?? '');

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AchievementInput>({
    resolver: zodResolver(AchievementInputSchema),
    defaultValues: {
      title: '',
      category: 'other',
      issuer: '',
      date: '2025-01-01',
      description: '',
      link: '',
      image: null,
      order: 0,
      status: 'draft',
    },
  });

  useEffect(() => {
    if (existing) {
      reset({
        ...existing,
        date: existing.date.slice(0, 10),
        link: existing.link ?? '',
      });
    }
  }, [existing, reset]);

  const onSubmit = async (values: AchievementInput) => {
    try {
      if (isNew) {
        await createMutation.mutateAsync(values);
        notify('Achievement created', 'success');
      } else {
        await updateMutation.mutateAsync(values);
        notify('Achievement updated', 'success');
      }
      navigate('/admin/achievements');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Save failed', 'error');
    }
  };

  return (
    <AdminShell title={isNew ? 'New Achievement' : 'Edit Achievement'}>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-textPrimary">
          {isNew ? 'New achievement' : 'Edit achievement'}
        </h1>
        <Link
          to="/admin/achievements"
          className="text-sm font-medium text-textMuted hover:text-textPrimary"
        >
          &larr; Back to list
        </Link>
      </div>

      {!isNew && isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-5">
          <FormField id="title" label="Title" required error={errors.title?.message}>
            <Input id="title" {...register('title')} error={errors.title?.message} />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField id="category" label="Category" error={errors.category?.message}>
              <Select id="category" {...register('category')}>
                <option value="award">Award</option>
                <option value="competition">Competition</option>
                <option value="publication">Publication</option>
                <option value="speaking">Speaking</option>
                <option value="other">Other</option>
              </Select>
            </FormField>
            <FormField
              id="issuer"
              label="Issuer / Organization"
              required
              error={errors.issuer?.message}
            >
              <Input id="issuer" {...register('issuer')} error={errors.issuer?.message} />
            </FormField>
            <FormField id="date" label="Date" required error={errors.date?.message}>
              <Input id="date" type="date" {...register('date')} error={errors.date?.message} />
            </FormField>
          </div>

          <FormField id="link" label="Reference Link" error={errors.link?.message}>
            <Input
              id="link"
              type="url"
              placeholder="https://..."
              {...register('link')}
              error={errors.link?.message}
            />
          </FormField>

          <FormField
            id="description"
            label="Description (Markdown)"
            error={errors.description?.message}
          >
            <Textarea
              id="description"
              rows={4}
              {...register('description')}
              error={errors.description?.message}
            />
          </FormField>

          <Controller
            control={control}
            name="image"
            render={({ field }) => (
              <ImageField
                id="image"
                label="Optional Image"
                value={field.value}
                onChange={field.onChange}
                error={errors.image?.message}
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

          <div className="flex flex-wrap gap-3 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save achievement'}
            </Button>
          </div>
        </form>
      )}
    </AdminShell>
  );
}
