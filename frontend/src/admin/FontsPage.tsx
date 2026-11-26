import type { FontSettings } from '@portfolio/shared';
import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Skeleton } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';
import { useAdminProfile, useUpdateAdminProfile } from '../features/auth/queries';
import { FormField } from '../forms/FormField';
import { applyFontSettings, FONT_LIBRARY, PORTFOLIO_SECTIONS } from '../lib/fontLibrary';
import { AdminShell } from './AdminShell';

const DEFAULT_FONTS: FontSettings = {
  headingFont: 'Michroma',
  bodyFont: 'Michroma',
  h1Font: 'Michroma',
  h2Font: 'Michroma',
  h3Font: 'Michroma',
  h4Font: 'Michroma',
  h5Font: 'Michroma',
  h6Font: 'Michroma',
  paragraphFont: 'Michroma',
  customFontUrl: '',
  customFontName: '',
  sectionFonts: {},
};

export function FontsPage() {
  const { data: profile, isLoading } = useAdminProfile();
  const updateMutation = useUpdateAdminProfile();
  const { notify } = useToast();
  const [fonts, setFonts] = useState<FontSettings>(DEFAULT_FONTS);

  useEffect(() => {
    if (profile?.fonts) {
      setFonts({
        ...DEFAULT_FONTS,
        ...profile.fonts,
        sectionFonts: profile.fonts.sectionFonts ?? {},
      });
    }
  }, [profile]);

  const fontChoices = [
    ...(fonts.customFontName.trim()
      ? [{ name: fonts.customFontName.trim(), label: `${fonts.customFontName.trim()} (Custom)` }]
      : []),
    ...FONT_LIBRARY.map((f) => ({ name: f.name, label: `${f.name} (${f.category})` })),
  ];

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync({ fonts });
      applyFontSettings(fonts);
      notify('Typography & font settings updated', 'success');
    } catch (err) {
      notify(err instanceof Error ? err.message : 'Failed to update fonts', 'error');
    }
  };

  const resetToMichroma = () => {
    setFonts(DEFAULT_FONTS);
    applyFontSettings(DEFAULT_FONTS);
  };

  return (
    <AdminShell title="Fonts & Typography">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Font Library &amp; Typography</h1>
          <p className="text-sm text-textMuted">
            Assign Michroma, Google Fonts, or a custom font stylesheet to headings, paragraphs, and
            individual sections.
          </p>
        </div>
        <Button type="button" variant="secondary" onClick={resetToMichroma}>
          Reset all to Michroma
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-96 w-full" />
      ) : (
        <form onSubmit={handleSave} className="max-w-4xl space-y-6">
          <div className="rounded-card border border-border bg-surface p-5">
            <h2 className="text-base font-semibold text-textPrimary">
              Global Default Fonts (Title &amp; Body Text)
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <FormField id="headingFont" label="Default Title / Heading Font">
                <Select
                  id="headingFont"
                  value={fonts.headingFont}
                  onChange={(e) => setFonts({ ...fonts, headingFont: e.target.value })}
                >
                  {fontChoices.map((f) => (
                    <option key={f.name} value={f.name}>
                      {f.label}
                    </option>
                  ))}
                </Select>
              </FormField>

              <FormField id="bodyFont" label="Default Body / Other Text Font">
                <Select
                  id="bodyFont"
                  value={fonts.bodyFont}
                  onChange={(e) => setFonts({ ...fonts, bodyFont: e.target.value })}
                >
                  {fontChoices.map((f) => (
                    <option key={f.name} value={f.name}>
                      {f.label}
                    </option>
                  ))}
                </Select>
              </FormField>
            </div>
          </div>

          <div className="rounded-card border border-border bg-surface p-5">
            <h2 className="text-base font-semibold text-textPrimary">
              Element Fonts (H1–H6 &amp; Paragraph)
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {(
                [
                  ['h1Font', 'H1 Font'],
                  ['h2Font', 'H2 Font'],
                  ['h3Font', 'H3 Font'],
                  ['h4Font', 'H4 Font'],
                  ['h5Font', 'H5 Font'],
                  ['h6Font', 'H6 Font'],
                  ['paragraphFont', 'Paragraph (p)'],
                ] as const
              ).map(([key, label]) => (
                <FormField key={key} id={key} label={label}>
                  <Select
                    id={key}
                    value={fonts[key] ?? ''}
                    onChange={(e) => setFonts({ ...fonts, [key]: e.target.value })}
                  >
                    <option value="">Inherit default</option>
                    {fontChoices.map((f) => (
                      <option key={f.name} value={f.name}>
                        {f.label}
                      </option>
                    ))}
                  </Select>
                </FormField>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-border bg-surface p-5">
            <h2 className="text-base font-semibold text-textPrimary">Section-Specific Fonts</h2>
            <p className="mt-1 text-xs text-textMuted">
              Override fonts for any individual section, or leave as &ldquo;Inherit global&rdquo;.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {PORTFOLIO_SECTIONS.map((sec) => (
                <FormField key={sec.id} id={`sec-${sec.id}`} label={sec.label}>
                  <Select
                    id={`sec-${sec.id}`}
                    value={fonts.sectionFonts?.[sec.id] ?? ''}
                    onChange={(e) =>
                      setFonts({
                        ...fonts,
                        sectionFonts: {
                          ...fonts.sectionFonts,
                          [sec.id]: e.target.value,
                        },
                      })
                    }
                  >
                    <option value="">Inherit global</option>
                    {fontChoices.map((f) => (
                      <option key={f.name} value={f.name}>
                        {f.label}
                      </option>
                    ))}
                  </Select>
                </FormField>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-border bg-surface p-5">
            <h2 className="text-base font-semibold text-textPrimary">Custom Font Stylesheet</h2>
            <p className="mt-1 text-xs text-textMuted">
              Optional: paste a Google Fonts CSS URL (e.g.
              https://fonts.googleapis.com/css2?family=Syne:wght@700&amp;display=swap) and enter its
              font family name to add it to the dropdowns above.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <FormField id="customFontName" label="Custom Font Family Name">
                <Input
                  id="customFontName"
                  placeholder="e.g. Clash Display"
                  value={fonts.customFontName}
                  onChange={(e) => setFonts({ ...fonts, customFontName: e.target.value })}
                />
              </FormField>
              <FormField id="customFontUrl" label="Custom Font CSS URL">
                <Input
                  id="customFontUrl"
                  type="url"
                  placeholder="https://fonts.googleapis.com/css2?..."
                  value={fonts.customFontUrl}
                  onChange={(e) => setFonts({ ...fonts, customFontUrl: e.target.value })}
                />
              </FormField>
            </div>
          </div>

          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Saving...' : 'Save typography settings'}
          </Button>
        </form>
      )}
    </AdminShell>
  );
}
