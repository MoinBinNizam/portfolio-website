import { zodResolver } from '@hookform/resolvers/zod';
import { ProfileInputSchema, type ProfileInput } from '@portfolio/shared';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Skeleton } from '../components/ui/Skeleton';
import { Textarea } from '../components/ui/Textarea';
import { useToast } from '../components/ui/Toast';
import { useAdminProfile, useUpdateAdminProfile } from '../features/auth/queries';
import { FormField } from '../forms/FormField';
import { ImageField } from '../forms/ImageField';
import { AdminShell } from './AdminShell';

export function ProfilePage() {
  const { data: profile, isLoading } = useAdminProfile();
  const updateMutation = useUpdateAdminProfile();
  const { notify } = useToast();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInput>({
    resolver: zodResolver(ProfileInputSchema),
    defaultValues: {
      name: '',
      headline: '',
      tagline: '',
      intro: '',
      about: '',
      email: '',
      phone: '',
      officeAddress: '',
      location: '',
      resumeUrl: '',
      avatar: null,
      socials: {
        github: '',
        linkedin: '',
        facebook: '',
        x: '',
        instagram: '',
        youtube: '',
        behance: '',
      },
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        ...profile,
        phone: profile.phone ?? '',
        officeAddress: profile.officeAddress ?? '',
        location: profile.location ?? '',
        resumeUrl: profile.resumeUrl ?? '',
        socials: {
          github: profile.socials?.github ?? '',
          linkedin: profile.socials?.linkedin ?? '',
          facebook: profile.socials?.facebook ?? '',
          x: profile.socials?.x ?? '',
          instagram: profile.socials?.instagram ?? '',
          youtube: profile.socials?.youtube ?? '',
          behance: profile.socials?.behance ?? '',
        },
      });
    }
  }, [profile, reset]);

  const onSubmit = async (values: ProfileInput) => {
    try {
      await updateMutation.mutateAsync(values);
      notify('Profile updated and live on public site', 'success');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to update profile', 'error');
    }
  };

  return (
    <AdminShell title="Profile">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-textPrimary">Profile &amp; Social Links</h1>
        <p className="text-sm text-textMuted">
          Changes here update the Hero, About, Contact, and Footer social icons immediately.
        </p>
      </div>

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="name" label="Full Name" required error={errors.name?.message}>
              <Input id="name" {...register('name')} error={errors.name?.message} />
            </FormField>
            <FormField id="email" label="Public Email" required error={errors.email?.message}>
              <Input id="email" type="email" {...register('email')} error={errors.email?.message} />
            </FormField>
          </div>

          <FormField id="headline" label="Headline" required error={errors.headline?.message}>
            <Input id="headline" {...register('headline')} error={errors.headline?.message} />
          </FormField>

          <FormField id="tagline" label="Tagline" required error={errors.tagline?.message}>
            <Input id="tagline" {...register('tagline')} error={errors.tagline?.message} />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="location" label="Location" error={errors.location?.message}>
              <Input id="location" {...register('location')} error={errors.location?.message} />
            </FormField>
            <FormField id="phone" label="Phone (optional)" error={errors.phone?.message}>
              <Input id="phone" {...register('phone')} error={errors.phone?.message} />
            </FormField>
          </div>

          <FormField id="intro" label="Hero Introduction" required error={errors.intro?.message}>
            <Textarea id="intro" rows={3} {...register('intro')} error={errors.intro?.message} />
          </FormField>

          <FormField
            id="about"
            label="About Text (Markdown)"
            required
            error={errors.about?.message}
          >
            <Textarea id="about" rows={5} {...register('about')} error={errors.about?.message} />
          </FormField>

          <Controller
            control={control}
            name="avatar"
            render={({ field }) => (
              <ImageField
                id="avatar"
                label="Profile Portrait"
                value={field.value}
                onChange={field.onChange}
                error={errors.avatar?.message}
              />
            )}
          />

          <div className="space-y-4 rounded-card border border-border bg-surface p-5">
            <h2 className="text-base font-semibold text-textPrimary">Social Media Links</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                id="social-github"
                label="GitHub URL"
                error={errors.socials?.github?.message}
              >
                <Input id="social-github" type="url" {...register('socials.github')} />
              </FormField>
              <FormField
                id="social-linkedin"
                label="LinkedIn URL"
                error={errors.socials?.linkedin?.message}
              >
                <Input id="social-linkedin" type="url" {...register('socials.linkedin')} />
              </FormField>
              <FormField
                id="social-facebook"
                label="Facebook URL"
                error={errors.socials?.facebook?.message}
              >
                <Input id="social-facebook" type="url" {...register('socials.facebook')} />
              </FormField>
              <FormField id="social-x" label="X (Twitter) URL" error={errors.socials?.x?.message}>
                <Input id="social-x" type="url" {...register('socials.x')} />
              </FormField>
              <FormField
                id="social-instagram"
                label="Instagram URL"
                error={errors.socials?.instagram?.message}
              >
                <Input id="social-instagram" type="url" {...register('socials.instagram')} />
              </FormField>
              <FormField
                id="social-youtube"
                label="YouTube URL"
                error={errors.socials?.youtube?.message}
              >
                <Input id="social-youtube" type="url" {...register('socials.youtube')} />
              </FormField>
              <FormField
                id="social-behance"
                label="Behance URL"
                error={errors.socials?.behance?.message}
              >
                <Input id="social-behance" type="url" {...register('socials.behance')} />
              </FormField>
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting || updateMutation.isPending}>
            {isSubmitting || updateMutation.isPending ? 'Saving...' : 'Save profile'}
          </Button>
        </form>
      )}
    </AdminShell>
  );
}
