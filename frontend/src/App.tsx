import { Badge } from './components/ui/Badge';
import { Button } from './components/ui/Button';
import { Card } from './components/ui/Card';
import { Container } from './components/ui/Container';
import { SectionHeading } from './components/ui/SectionHeading';
import { ThemeProvider } from './theme/ThemeProvider';
import { ThemeToggle } from './theme/ThemeToggle';

export function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-textPrimary">
        <header className="border-b border-border bg-surface">
          <Container className="flex items-center justify-between py-4">
            <span className="text-base font-bold tracking-tight text-textPrimary">Moin Uddin</span>
            <ThemeToggle />
          </Container>
        </header>

        <main className="py-12">
          <Container>
            <SectionHeading
              eyebrow="Day 1 Foundation"
              title="Design tokens and theme primitives"
              description="Both dark and light themes read from CSS variables defined in theme/tokens.css."
            />

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <div className="flex items-center gap-2">
                  <Badge variant="accent">Active Theme</Badge>
                  <Badge variant="neutral">Monorepo Ready</Badge>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-textPrimary">
                  Semantic surface &amp; typography
                </h3>
                <p className="mt-2 text-sm text-textMuted">
                  All colours, radii, and transitions come from design-tokens.json via CSS custom
                  properties.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button variant="primary">Primary Action</Button>
                  <Button variant="secondary">Secondary Action</Button>
                </div>
              </Card>

              <Card>
                <Badge variant="highlight">Highlight Token</Badge>
                <h3 className="mt-4 text-lg font-semibold text-textPrimary">
                  Accessible contrast &amp; reduced motion
                </h3>
                <p className="mt-2 text-sm text-textMuted">
                  Focus outlines use the accent colour, and theme preference persists across reloads
                  without flash.
                </p>
              </Card>
            </div>
          </Container>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
