import { zodResolver } from '@hookform/resolvers/zod';
import { ServiceInputSchema, type ContentStatus, type ServiceInput } from '@portfolio/shared';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Textarea } from '../../../components/ui/Textarea';
import { useToast } from '../../../components/ui/Toast';
import {
  useCreateService,
  useServiceItem,
  useUpdateService,
} from '../../../features/services/queries';
import { FormField } from '../../../forms/FormField';
import { StatusField } from '../../../forms/StatusField';
import { TagsField } from '../../../forms/TagsField';
import { AdminShell } from '../../AdminShell';

export function ServiceEditorPage() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const { notify } = useToast();

  const { data: existing, isLoading } = useServiceItem(isNew ? undefined : id);
  const createMutation = useCreateService();
  const updateMutation = useUpdateService(id ?? '');

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ServiceInput>({
    resolver: zodResolver(ServiceInputSchema),
    defaultValues: {
      title: '',
      summary: '',
      description: '',
      icon: '',
      deliverables: [],
      order: 0,
      status: 'draft',
    },
  });

  useEffect(() => {
    if (existing) {
      reset(existing);
    }
  }, [existing, reset]);

  const onSubmit = async (values: ServiceInput) => {
    try {
      if (isNew) {
        await createMutation.mutateAsync(values);
        notify('Service created', 'success');
      } else {
        await updateMutation.mutateAsync(values);
        notify('Service updated', 'success');
      }
      navigate('/admin/services');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Save failed', 'error');
    }
  };

  return (
    <AdminShell title={isNew ? 'New Service' : 'Edit Service'}>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-textPrimary">
          {isNew ? 'New service' : 'Edit service'}
        </h1>
        <Link
          to="/admin/services"
          className="text-sm font-medium text-textMuted hover:text-textPrimary"
        >
          &larr; Back to list
        </Link>
      </div>

      {!isNew && isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-5">
          <FormField id="title" label="Service Title" required error={errors.title?.message}>
            <Input id="title" {...register('title')} error={errors.title?.message} />
          </FormField>

          <FormField id="summary" label="Short Summary" error={errors.summary?.message}>
            <Input id="summary" {...register('summary')} error={errors.summary?.message} />
          </FormField>

          <FormField id="description" label="Description" error={errors.description?.message}>
            <Textarea
              id="description"
              rows={4}
              {...register('description')}
              error={errors.description?.message}
            />
          </FormField>

          <Controller
            control={control}
            name="deliverables"
            render={({ field }) => (
              <TagsField
                id="deliverables"
                label="Deliverables"
                value={field.value}
                onChange={field.onChange}
                placeholder="Add deliverable and press Enter"
                error={errors.deliverables?.message}
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
            {isSubmitting ? 'Saving...' : 'Save service'}
          </Button>
        </form>
      )}
    </AdminShell>
  );
}
