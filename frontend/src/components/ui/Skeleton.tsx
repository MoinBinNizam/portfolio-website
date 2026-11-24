interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = 'h-5 w-full' }: SkeletonProps) {
  return (
    <div aria-hidden="true" className={`animate-pulse rounded-input bg-surfaceAlt ${className}`} />
  );
}
