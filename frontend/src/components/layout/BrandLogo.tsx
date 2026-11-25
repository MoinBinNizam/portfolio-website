import { Link } from 'react-router-dom';

interface BrandLogoProps {
  onClick?: () => void;
  className?: string;
}

export function BrandLogo({ onClick, className = 'h-8 w-auto' }: BrandLogoProps) {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="Moin Uddin — Home"
      className="inline-flex items-center rounded-input bg-textPrimary px-2 py-1 transition-opacity duration-fast hover:opacity-90 dark:bg-transparent dark:p-0"
    >
      <img
        src="/images/moin-uddin-logo-300x69.png"
        alt="Moin Uddin — Web Developer"
        width={300}
        height={69}
        className={className}
      />
    </Link>
  );
}
