import type { ReactNode } from 'react';

function renderInline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const tokenRegex = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('`') && token.endsWith('`')) {
      parts.push(
        <code
          key={key++}
          className="rounded bg-surfaceAlt px-1.5 py-0.5 font-mono text-xs text-accent"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={key++} className="font-semibold text-textPrimary">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith('[')) {
      const linkMatch = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
      if (linkMatch) {
        const label = linkMatch[1] ?? '';
        const href = linkMatch[2] ?? '';
        const safeHref = /^https?:\/\//i.test(href) || href.startsWith('/') ? href : '#';
        parts.push(
          <a
            key={key++}
            href={safeHref}
            target={safeHref.startsWith('http') ? '_blank' : undefined}
            rel={safeHref.startsWith('http') ? 'noreferrer' : undefined}
            className="text-accent underline underline-offset-4 hover:text-accentHover"
          >
            {label}
          </a>,
        );
      }
    }
    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

export function renderSafeMarkdown(markdown: string): ReactNode[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i] ?? '';

    if (line.startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !(lines[i] ?? '').startsWith('```')) {
        codeLines.push(lines[i] ?? '');
        i++;
      }
      blocks.push(
        <pre
          key={key++}
          className="overflow-x-auto rounded-card border border-border bg-surfaceAlt p-4 font-mono text-xs text-textPrimary"
        >
          <code>{codeLines.join('\n')}</code>
        </pre>,
      );
      i++;
      continue;
    }

    if (line.startsWith('### ')) {
      blocks.push(
        <h3 key={key++} className="pt-3 text-lg font-semibold text-textPrimary">
          {renderInline(line.slice(4))}
        </h3>,
      );
      i++;
      continue;
    }

    if (line.startsWith('## ')) {
      blocks.push(
        <h2 key={key++} className="pt-4 text-xl font-bold text-textPrimary">
          {renderInline(line.slice(3))}
        </h2>,
      );
      i++;
      continue;
    }

    if (line.startsWith('# ')) {
      blocks.push(
        <h1 key={key++} className="pt-4 text-2xl font-bold text-textPrimary">
          {renderInline(line.slice(2))}
        </h1>,
      );
      i++;
      continue;
    }

    if (line.startsWith('- ') || line.startsWith('* ')) {
      const items: string[] = [];
      while (
        i < lines.length &&
        ((lines[i] ?? '').startsWith('- ') || (lines[i] ?? '').startsWith('* '))
      ) {
        items.push((lines[i] ?? '').slice(2));
        i++;
      }
      blocks.push(
        <ul key={key++} className="list-disc space-y-1.5 pl-6 text-base text-textMuted">
          {items.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    if (line.startsWith('> ')) {
      blocks.push(
        <blockquote
          key={key++}
          className="border-l-2 border-accent pl-4 text-base italic text-textMuted"
        >
          {renderInline(line.slice(2))}
        </blockquote>,
      );
      i++;
      continue;
    }

    const imgMatch = /^!\[([^\]]*)\]\(([^)]+)\)$/.exec(line.trim());
    if (imgMatch) {
      const alt = imgMatch[1] || 'Article image';
      const src = imgMatch[2] || '';
      if (/^https?:\/\//i.test(src) || src.startsWith('/')) {
        blocks.push(
          <figure
            key={key++}
            className="overflow-hidden rounded-card border border-border bg-surface"
          >
            <img src={src} alt={alt} className="w-full object-cover" />
          </figure>,
        );
      }
      i++;
      continue;
    }

    if (!line.trim()) {
      i++;
      continue;
    }

    blocks.push(
      <p key={key++} className="max-w-[65ch] text-base leading-relaxed text-textMuted">
        {renderInline(line)}
      </p>,
    );
    i++;
  }

  return blocks;
}

export function MarkdownBody({ content }: { content: string }) {
  return <div className="space-y-4">{renderSafeMarkdown(content)}</div>;
}
