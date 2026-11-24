interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="mb-8 max-w-2xl">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
        {eyebrow}
      </p>
      <h2 className="text-2xl font-bold tracking-tight text-textPrimary sm:text-3xl">{title}</h2>
      {description ? <p className="mt-3 text-base text-textMuted">{description}</p> : null}
    </div>
  );
}
