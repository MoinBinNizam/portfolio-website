import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Container } from '../components/ui/Container';
import { Skeleton } from '../components/ui/Skeleton';
import { useAuthMe } from '../features/auth/queries';

export function RequireOwner({ children }: { children: ReactNode }) {
  const { data: user, isLoading, isError } = useAuthMe();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-16">
        <Container className="space-y-4">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-64 w-full" />
        </Container>
      </div>
    );
  }

  if (isError || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
