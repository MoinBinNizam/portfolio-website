import { describe, expect, it } from 'vitest';
import tokens from '../../../design-tokens.json';

describe('design-tokens.json', () => {
  it('defines both dark and light themes with dark as default', () => {
    expect(tokens.defaultTheme).toBe('dark');
    expect(tokens.themes.dark.background.value).toBeTruthy();
    expect(tokens.themes.light.background.value).toBeTruthy();
  });
});
