import { zodResolver } from '@hookform/resolvers/zod';
import {
  TestimonialInputSchema,
  type ContentStatus,
  type TestimonialInput,
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
  useCreateTestimonial,
  useTestimonialItem,
  useUpdateTestimonial,
} from '../../../features/testimonials/queries';
import { FormField } from '../../../forms/FormField';
import { ImageField } from '../../../forms/ImageField';
import { StatusField } from '../../../forms/StatusField';
import { AdminShell } from '../../AdminShell';

export function TestimonialEditorPage() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const { notify } = useToast();

  const { data: existing, isLoading } = useTestimonialItem(isNew ? undefined : id);
  const createMutation = useCreateTestimonial();
  const updateMutation = useUpdateTestimonial(id ?? '');

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialInput>({
    resolver: zodResolver(TestimonialInputSchema),
    defaultValues: {
      name: '',
      role: '',
      company: '',
      quote: '',
      rating: 5,
      avatar: null,
      verified: true,
      order: 0,
      status: 'draft',
    },
  });

  useEffect(() => {
    if (existing) {
      reset(existing);
    }
  }, [existing, reset]);

  const onSubmit = async (values: TestimonialInput) => {
    try {
      if (isNew) {
        await createMutation.mutateAsync(values);
        notify('Testimonial created', 'success');
      } else {
        await updateMutation.mutateAsync(values);
        notify('Testimonial updated', 'success');
      }
      navigate('/admin/testimonials');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Save failed', 'error');
    }
  };

  return (
    <AdminShell title={isNew ? 'New Testimonial' : 'Edit Testimonial'}>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-textPrimary">
          {isNew ? 'New testimonial' : 'Edit testimonial'}
        </h1>
        <Link
          to="/admin/testimonials"
          className="text-sm font-medium text-textMuted hover:text-textPrimary"
        >
          &larr; Back to list
        </Link>
      </div>

      {!isNew && isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="name" label="Reviewer Name" required error={errors.name?.message}>
              <Input id="name" {...register('name')} error={errors.name?.message} />
            </FormField>
            <FormField id="role" label="Designation / Role" required error={errors.role?.message}>
              <Input id="role" {...register('role')} error={errors.role?.message} />
            </FormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="company" label="Company Name" error={errors.company?.message}>
              <Input id="company" {...register('company')} error={errors.company?.message} />
            </FormField>
            <FormField
              id="rating"
              label="Star Rating (1–5)"
              required
              error={errors.rating?.message}
            >
              <Select id="rating" {...register('rating', { valueAsNumber: true })}>
                <option value={5}>5 Stars</option>
                <option value={4}>4 Stars</option>
                <option value={3}>3 Stars</option>
                <option value={2}>2 Stars</option>
                <option value={1}>1 Star</option>
              </Select>
            </FormField>
          </div>

          <FormField id="quote" label="Review / Quote" required error={errors.quote?.message}>
            <Textarea id="quote" rows={4} {...register('quote')} error={errors.quote?.message} />
          </FormField>

          <Controller
            control={control}
            name="avatar"
            render={({ field }) => (
              <ImageField
                id="avatar"
                label="Reviewer Photo"
                value={field.value}
                onChange={field.onChange}
                error={errors.avatar?.message}
              />
            )}
          />

          <label className="flex items-center gap-2 text-sm text-textPrimary">
            <input type="checkbox" {...register('verified')} className="h-4 w-4 accent-accent" />
            <span>Verified client review</span>
          </label>

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
            {isSubmitting ? 'Saving...' : 'Save testimonial'}
          </Button>
        </form>
      )}
    </AdminShell>
  );
}
