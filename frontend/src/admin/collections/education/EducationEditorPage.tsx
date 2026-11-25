import { zodResolver } from '@hookform/resolvers/zod';
import { EducationInputSchema, type ContentStatus, type EducationInput } from '@portfolio/shared';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Textarea } from '../../../components/ui/Textarea';
import { useToast } from '../../../components/ui/Toast';
import {
  useCreateEducation,
  useEducationItem,
  useUpdateEducation,
} from '../../../features/education/queries';
import { FormField } from '../../../forms/FormField';
import { StatusField } from '../../../forms/StatusField';
import { AdminShell } from '../../AdminShell';

export function EducationEditorPage() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const { notify } = useToast();

  const { data: existing, isLoading } = useEducationItem(isNew ? undefined : id);
  const createMutation = useCreateEducation();
  const updateMutation = useUpdateEducation(id ?? '');

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EducationInput>({
    resolver: zodResolver(EducationInputSchema),
    defaultValues: {
      institution: '',
      degree: '',
      field: '',
      grade: '',
      startYear: null,
      endYear: new Date().getFullYear(),
      activities: '',
      logo: null,
      order: 0,
      status: 'draft',
    },
  });

  useEffect(() => {
    if (existing) {
      reset(existing);
    }
  }, [existing, reset]);

  const onSubmit = async (values: EducationInput) => {
    try {
      if (isNew) {
        await createMutation.mutateAsync(values);
        notify('Education created', 'success');
      } else {
        await updateMutation.mutateAsync(values);
        notify('Education updated', 'success');
      }
      navigate('/admin/education');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Save failed', 'error');
    }
  };

  return (
    <AdminShell title={isNew ? 'New Education' : 'Edit Education'}>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-textPrimary">
          {isNew ? 'New education' : 'Edit education'}
        </h1>
        <Link
          to="/admin/education"
          className="text-sm font-medium text-textMuted hover:text-textPrimary"
        >
          &larr; Back to list
        </Link>
      </div>

      {!isNew && isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-5">
          <FormField
            id="institution"
            label="Institution"
            required
            error={errors.institution?.message}
          >
            <Input
              id="institution"
              {...register('institution')}
              error={errors.institution?.message}
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="degree" label="Degree" required error={errors.degree?.message}>
              <Input id="degree" {...register('degree')} error={errors.degree?.message} />
            </FormField>
            <FormField id="field" label="Field of Study" error={errors.field?.message}>
              <Input id="field" {...register('field')} error={errors.field?.message} />
            </FormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField id="startYear" label="Start Year" error={errors.startYear?.message}>
              <Input
                id="startYear"
                type="number"
                {...register('startYear', {
                  setValueAs: (v) => (v === '' || v === null ? null : Number(v)),
                })}
                error={errors.startYear?.message}
              />
            </FormField>
            <FormField id="endYear" label="End Year" error={errors.endYear?.message}>
              <Input
                id="endYear"
                type="number"
                {...register('endYear', {
                  setValueAs: (v) => (v === '' || v === null ? null : Number(v)),
                })}
                error={errors.endYear?.message}
              />
            </FormField>
            <FormField id="grade" label="Grade / GPA" error={errors.grade?.message}>
              <Input id="grade" {...register('grade')} error={errors.grade?.message} />
            </FormField>
          </div>

          <FormField id="activities" label="Activities & Notes" error={errors.activities?.message}>
            <Textarea
              id="activities"
              rows={3}
              {...register('activities')}
              error={errors.activities?.message}
            />
          </FormField>

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
              {isSubmitting ? 'Saving...' : 'Save education'}
            </Button>
          </div>
        </form>
      )}
    </AdminShell>
  );
}
