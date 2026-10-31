import type { Config } from 'tailwindcss';
import preset from '@asiavoyage/tokens/tailwind-preset';

export default {
  presets: [preset],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
} satisfies Config;
