import { zodResolver } from '@hookform/resolvers/zod';
import { ExperienceInputSchema, type ContentStatus, type ExperienceInput } from '@portfolio/shared';
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
  useCreateExperience,
  useExperienceItem,
  useUpdateExperience,
} from '../../../features/experience/queries';
import { FormField } from '../../../forms/FormField';
import { StatusField } from '../../../forms/StatusField';
import { TagsField } from '../../../forms/TagsField';
import { AdminShell } from '../../AdminShell';

function toMonthInput(iso?: string | null): string {
  if (!iso) return '';
  return iso.slice(0, 7);
}

function fromMonthInput(month: string): string {
  return month ? `${month}-01` : '';
}

export function ExperienceEditorPage() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const { notify } = useToast();

  const { data: existing, isLoading } = useExperienceItem(isNew ? undefined : id);
  const createMutation = useCreateExperience();
  const updateMutation = useUpdateExperience(id ?? '');

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceInput>({
    resolver: zodResolver(ExperienceInputSchema),
    defaultValues: {
      company: '',
      role: '',
      employmentType: 'full-time',
      location: '',
      companyUrl: '',
      startDate: '2025-01-01',
      endDate: null,
      isCurrent: false,
      description: '',
      achievements: [],
      techStack: [],
      order: 0,
      status: 'draft',
    },
  });

  useEffect(() => {
    if (existing) {
      reset({
        ...existing,
        companyUrl: existing.companyUrl ?? '',
        startDate: existing.startDate.slice(0, 10),
        endDate: existing.endDate ? existing.endDate.slice(0, 10) : null,
      });
    }
  }, [existing, reset]);

  const isCurrent = watch('isCurrent');

  const onSubmit = async (values: ExperienceInput) => {
    try {
      const payload: ExperienceInput = {
        ...values,
        endDate: values.isCurrent ? null : values.endDate || null,
      };
      if (isNew) {
        await createMutation.mutateAsync(payload);
        notify('Experience created', 'success');
      } else {
        await updateMutation.mutateAsync(payload);
        notify('Experience updated', 'success');
      }
      navigate('/admin/experience');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Save failed', 'error');
    }
  };

  return (
    <AdminShell title={isNew ? 'New Experience' : 'Edit Experience'}>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-textPrimary">
          {isNew ? 'New experience' : 'Edit experience'}
        </h1>
        <Link
          to="/admin/experience"
          className="text-sm font-medium text-textMuted hover:text-textPrimary"
        >
          &larr; Back to list
        </Link>
      </div>

      {!isNew && isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="company" label="Company" required error={errors.company?.message}>
              <Input id="company" {...register('company')} error={errors.company?.message} />
            </FormField>
            <FormField id="role" label="Role" required error={errors.role?.message}>
              <Input id="role" {...register('role')} error={errors.role?.message} />
            </FormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              id="employmentType"
              label="Employment Type"
              error={errors.employmentType?.message}
            >
              <Select id="employmentType" {...register('employmentType')}>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </Select>
            </FormField>
            <FormField id="location" label="Location" error={errors.location?.message}>
              <Input id="location" {...register('location')} error={errors.location?.message} />
            </FormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              id="startDate"
              label="Start Month"
              required
              error={errors.startDate?.message}
            >
              <Input
                id="startDate"
                type="month"
                value={toMonthInput(watch('startDate'))}
                onChange={(e) => setValue('startDate', fromMonthInput(e.target.value))}
                error={errors.startDate?.message}
              />
            </FormField>
            <FormField id="endDate" label="End Month" error={errors.endDate?.message}>
              <Input
                id="endDate"
                type="month"
                disabled={isCurrent}
                value={toMonthInput(watch('endDate'))}
                onChange={(e) =>
                  setValue('endDate', e.target.value ? fromMonthInput(e.target.value) : null)
                }
                error={errors.endDate?.message}
              />
            </FormField>
          </div>

          <label className="flex items-center gap-2 text-sm text-textPrimary">
            <input type="checkbox" {...register('isCurrent')} className="h-4 w-4 accent-accent" />
            <span>I currently work here</span>
          </label>

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
            name="achievements"
            render={({ field }) => (
              <TagsField
                id="achievements"
                label="Key Achievements"
                value={field.value}
                onChange={field.onChange}
                placeholder="Add achievement and press Enter"
                error={errors.achievements?.message}
              />
            )}
          />

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
              {isSubmitting ? 'Saving...' : 'Save experience'}
            </Button>
          </div>
        </form>
      )}
    </AdminShell>
  );
}
