import { zodResolver } from '@hookform/resolvers/zod';
import {
  CertificationInputSchema,
  type CertificationInput,
  type ContentStatus,
} from '@portfolio/shared';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Skeleton } from '../../../components/ui/Skeleton';
import { useToast } from '../../../components/ui/Toast';
import {
  useCertificationItem,
  useCreateCertification,
  useUpdateCertification,
} from '../../../features/certifications/queries';
import { FileField } from '../../../forms/FileField';
import { FormField } from '../../../forms/FormField';
import { StatusField } from '../../../forms/StatusField';
import { TagsField } from '../../../forms/TagsField';
import { AdminShell } from '../../AdminShell';

export function CertificationEditorPage() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const { notify } = useToast();

  const { data: existing, isLoading } = useCertificationItem(isNew ? undefined : id);
  const createMutation = useCreateCertification();
  const updateMutation = useUpdateCertification(id ?? '');

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CertificationInput>({
    resolver: zodResolver(CertificationInputSchema),
    defaultValues: {
      title: '',
      issuer: '',
      issueDate: '2025-01-01',
      expiryDate: null,
      credentialId: '',
      credentialUrl: '',
      certificateFile: null,
      skills: [],
      order: 0,
      status: 'draft',
    },
  });

  useEffect(() => {
    if (existing) {
      reset({
        ...existing,
        issueDate: existing.issueDate.slice(0, 10),
        expiryDate: existing.expiryDate ? existing.expiryDate.slice(0, 10) : null,
        credentialUrl: existing.credentialUrl ?? '',
      });
    }
  }, [existing, reset]);

  const onSubmit = async (values: CertificationInput) => {
    try {
      const payload: CertificationInput = {
        ...values,
        expiryDate: values.expiryDate || null,
        credentialUrl: values.credentialUrl || '',
      };
      if (isNew) {
        await createMutation.mutateAsync(payload);
        notify('Certification created', 'success');
      } else {
        await updateMutation.mutateAsync(payload);
        notify('Certification updated', 'success');
      }
      navigate('/admin/certifications');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Save failed', 'error');
    }
  };

  return (
    <AdminShell title={isNew ? 'New Certification' : 'Edit Certification'}>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-textPrimary">
          {isNew ? 'New certification' : 'Edit certification'}
        </h1>
        <Link
          to="/admin/certifications"
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
            <FormField id="title" label="Title" required error={errors.title?.message}>
              <Input id="title" {...register('title')} error={errors.title?.message} />
            </FormField>
            <FormField id="issuer" label="Issuer" required error={errors.issuer?.message}>
              <Input id="issuer" {...register('issuer')} error={errors.issuer?.message} />
            </FormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="issueDate" label="Issue Date" required error={errors.issueDate?.message}>
              <Input
                id="issueDate"
                type="date"
                {...register('issueDate')}
                error={errors.issueDate?.message}
              />
            </FormField>
            <FormField id="expiryDate" label="Expiry Date" error={errors.expiryDate?.message}>
              <Input
                id="expiryDate"
                type="date"
                {...register('expiryDate', {
                  setValueAs: (v) => (v ? v : null),
                })}
                error={errors.expiryDate?.message}
              />
            </FormField>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="credentialId" label="Credential ID" error={errors.credentialId?.message}>
              <Input
                id="credentialId"
                {...register('credentialId')}
                error={errors.credentialId?.message}
              />
            </FormField>
            <FormField
              id="credentialUrl"
              label="Verification URL"
              error={errors.credentialUrl?.message}
            >
              <Input
                id="credentialUrl"
                type="url"
                placeholder="https://..."
                {...register('credentialUrl')}
                error={errors.credentialUrl?.message}
              />
            </FormField>
          </div>

          <Controller
            control={control}
            name="certificateFile"
            render={({ field }) => (
              <FileField
                id="certificateFile"
                label="Certificate File (PDF or Image)"
                value={field.value}
                onChange={field.onChange}
                error={errors.certificateFile?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="skills"
            render={({ field }) => (
              <TagsField
                id="skills"
                label="Skills Covered"
                value={field.value}
                onChange={field.onChange}
                placeholder="Add skill and press Enter"
                error={errors.skills?.message}
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
              {isSubmitting ? 'Saving...' : 'Save certification'}
            </Button>
          </div>
        </form>
      )}
    </AdminShell>
  );
}
