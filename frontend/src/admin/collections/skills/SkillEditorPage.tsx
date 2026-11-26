import { zodResolver } from '@hookform/resolvers/zod';
import { SkillInputSchema, type ContentStatus, type SkillInput } from '@portfolio/shared';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Skeleton } from '../../../components/ui/Skeleton';
import { useToast } from '../../../components/ui/Toast';
import { useCreateSkill, useSkillItem, useUpdateSkill } from '../../../features/skills/queries';
import { FormField } from '../../../forms/FormField';
import { StatusField } from '../../../forms/StatusField';
import { AdminShell } from '../../AdminShell';

export function SkillEditorPage() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const { notify } = useToast();

  const { data: existing, isLoading } = useSkillItem(isNew ? undefined : id);
  const createMutation = useCreateSkill();
  const updateMutation = useUpdateSkill(id ?? '');

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SkillInput>({
    resolver: zodResolver(SkillInputSchema),
    defaultValues: {
      name: '',
      category: 'frontend',
      level: 4,
      order: 0,
      status: 'draft',
    },
  });

  useEffect(() => {
    if (existing) {
      reset(existing);
    }
  }, [existing, reset]);

  const onSubmit = async (values: SkillInput) => {
    try {
      if (isNew) {
        await createMutation.mutateAsync(values);
        notify('Skill created', 'success');
      } else {
        await updateMutation.mutateAsync(values);
        notify('Skill updated', 'success');
      }
      navigate('/admin/skills');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Save failed', 'error');
    }
  };

  return (
    <AdminShell title={isNew ? 'New Skill' : 'Edit Skill'}>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-textPrimary">
          {isNew ? 'New skill' : 'Edit skill'}
        </h1>
        <Link
          to="/admin/skills"
          className="text-sm font-medium text-textMuted hover:text-textPrimary"
        >
          &larr; Back to list
        </Link>
      </div>

      {!isNew && isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-5">
          <FormField id="name" label="Skill Name" required error={errors.name?.message}>
            <Input id="name" {...register('name')} error={errors.name?.message} />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="category" label="Category" error={errors.category?.message}>
              <Select id="category" {...register('category')}>
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="database">Database</option>
                <option value="ai">AI &amp; Automation</option>
                <option value="tools">Tools</option>
                <option value="design">Design</option>
                <option value="cms">CMS</option>
              </Select>
            </FormField>
            <FormField id="level" label="Proficiency (1–5)" required error={errors.level?.message}>
              <Select id="level" {...register('level', { valueAsNumber: true })}>
                <option value={5}>5 — Expert</option>
                <option value={4}>4 — Proficient</option>
                <option value={3}>3 — Working knowledge</option>
                <option value={2}>2 — Familiar</option>
                <option value={1}>1 — Basic</option>
              </Select>
            </FormField>
          </div>

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
            {isSubmitting ? 'Saving...' : 'Save skill'}
          </Button>
        </form>
      )}
    </AdminShell>
  );
}
