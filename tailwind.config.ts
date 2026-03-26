import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'bg-deep': "var(--bg-deep)",
        'bg-surface': "var(--bg-surface)",
        'bg-glass': "var(--bg-glass)",
        'accent-gold': "var(--accent-gold)",
        'accent-lime': "var(--accent-lime)",
        'accent-teal': "var(--accent-teal)",
        'accent-coral': "var(--accent-coral)",
        'text-muted': "var(--text-muted)",
        'text-dim': "var(--text-dim)",
      },
    },
  },
  plugins: [],
} satisfies Config;
