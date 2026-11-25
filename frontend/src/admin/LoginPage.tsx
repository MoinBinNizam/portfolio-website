import { zodResolver } from '@hookform/resolvers/zod';
import { LoginInputSchema, type LoginInput } from '@portfolio/shared';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { BrandLogo } from '../components/layout/BrandLogo';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthMe, useLogin } from '../features/auth/queries';
import { FormField } from '../forms/FormField';
import { ThemeToggle } from '../theme/ThemeToggle';

export function LoginPage() {
  const navigate = useNavigate();
  const { data: user } = useAuthMe();
  const loginMutation = useLogin();
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginInputSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: LoginInput) => {
    setServerError(null);
    try {
      await loginMutation.mutateAsync(values);
      navigate('/admin', { replace: true });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5 py-12 text-textPrimary">
      <div className="w-full max-w-md rounded-card border border-border bg-surface p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <BrandLogo />
          <ThemeToggle />
        </div>

        <h1 className="text-xl font-bold text-textPrimary">Owner sign in</h1>
        <p className="mt-1 text-sm text-textMuted">
          Sign in with your owner credentials to manage portfolio content.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
          <FormField id="email" label="Email" required error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
              error={errors.email?.message}
            />
          </FormField>

          <FormField id="password" label="Password" required error={errors.password?.message}>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register('password')}
              error={errors.password?.message}
            />
          </FormField>

          {serverError ? (
            <div
              role="alert"
              className="rounded-input border border-highlight bg-highlight/10 px-3.5 py-2.5 text-xs font-medium text-highlight"
            >
              {serverError}
            </div>
          ) : null}

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || loginMutation.isPending}
          >
            {isSubmitting || loginMutation.isPending ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="mt-6 border-t border-border pt-4 text-center">
          <Link to="/" className="text-xs font-medium text-textMuted hover:text-accent">
            &larr; Back to public portfolio
          </Link>
        </div>
      </div>
    </div>
  );
}
