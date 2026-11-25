import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { MarkdownBody } from './markdown';

describe('Safe Markdown Renderer (#63)', () => {
  it('escapes raw <script> tags so they never execute', () => {
    const html = renderToStaticMarkup(
      <MarkdownBody content={'Hello\n\n<script>alert("xss")</script>\n\n**Safe**'} />,
    );
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
    expect(html).toContain('<strong');
  });

  it('blocks javascript: URLs in Markdown links', () => {
    const html = renderToStaticMarkup(
      <MarkdownBody content={'Click [here](javascript:alert(1))'} />,
    );
    expect(html).not.toContain('javascript:');
    expect(html).toContain('href="#"');
  });
});
