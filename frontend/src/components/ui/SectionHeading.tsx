import { SectionIcon, type IconName } from './SectionIcon';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  icon?: IconName;
}

export function SectionHeading({ eyebrow, title, description, icon }: SectionHeadingProps) {
  return (
    <div className="mb-8">
      <p className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        {icon ? <SectionIcon name={icon} className="h-3.5 w-3.5" /> : null}
        <span>{eyebrow}</span>
      </p>
      <h2 className="text-2xl font-bold tracking-tight text-textPrimary sm:text-3xl">{title}</h2>
      {description ? (
        <p className="mt-3 max-w-[65ch] text-base text-textMuted">{description}</p>
      ) : null}
    </div>
  );
}
