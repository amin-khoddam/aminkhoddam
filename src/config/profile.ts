/**
 * Structural profile data.
 *
 * Only locale-independent values live here (links, technologies, ordering).
 * Every human-readable string is in `src/i18n/messages/*.json`, keyed by the
 * ids below. Replace these placeholders with real details before publishing.
 */

export const profile = {
  email: "hello@example.com",
  phone: "+98 912 000 0000",
  resumePath: "/resume/amin-khoddam-frontend-resume.pdf",
  resumeFileName: "amin-khoddam-frontend-resume.pdf",
  socials: [
    { id: "github", url: "https://github.com/example" },
    { id: "linkedin", url: "https://linkedin.com/in/example" },
    { id: "telegram", url: "https://t.me/example" },
  ],
} as const;

export const heroStatIds = ["years", "projects", "locales", "lighthouse"] as const;

export const heroStack = ["React", "Next.js", "TypeScript", "Tailwind CSS", "Zustand"] as const;

export const aboutHighlightIds = ["systems", "performance", "accessibility", "quality"] as const;

export const aboutParagraphIds = ["p1", "p2", "p3"] as const;

export type SkillGroup = {
  id: string;
  skills: readonly string[];
};

export const skillGroups: readonly SkillGroup[] = [
  { id: "core", skills: ["React", "Next.js", "TypeScript", "JavaScript"] },
  { id: "ui", skills: ["Tailwind CSS", "shadcn/ui", "Radix UI", "Framer Motion", "RTL layouts"] },
  { id: "data", skills: ["Zustand", "TanStack Query", "React Hook Form", "Zod", "Axios"] },
  { id: "quality", skills: ["Vitest", "ESLint", "Prettier", "Clean architecture"] },
  { id: "delivery", skills: ["Docker", "GitHub Actions", "Web performance", "Accessibility"] },
];

export type ExperienceEntry = {
  id: string;
  current: boolean;
  highlightIds: readonly string[];
  stack: readonly string[];
};

export const experiences: readonly ExperienceEntry[] = [
  {
    id: "nikan",
    current: true,
    highlightIds: ["h1", "h2", "h3"],
    stack: ["Next.js", "TypeScript", "Zustand", "React Hook Form", "Zod"],
  },
  {
    id: "radmehr",
    current: false,
    highlightIds: ["h1", "h2", "h3"],
    stack: ["React", "TanStack Query", "Tailwind CSS", "next-intl"],
  },
  {
    id: "parsa",
    current: false,
    highlightIds: ["h1", "h2", "h3"],
    stack: ["React", "JavaScript", "Sass", "React Hook Form"],
  },
];

export type ProjectEntry = {
  id: string;
  featured: boolean;
  stack: readonly string[];
  /** Internal route within this app, rendered as a client-side link. */
  internalHref?: string;
  demoUrl?: string;
  repoUrl?: string;
};

export const projects: readonly ProjectEntry[] = [
  {
    id: "wallet",
    featured: true,
    stack: ["Next.js", "Zustand", "Zod", "Framer Motion", "vaul"],
    internalHref: "/wallet",
  },
  {
    id: "commerce",
    featured: false,
    stack: ["React", "TanStack Query", "TypeScript", "Tailwind CSS"],
    demoUrl: "https://example.com/commerce",
    repoUrl: "https://github.com/example/commerce-console",
  },
  {
    id: "booking",
    featured: false,
    stack: ["Next.js", "React Hook Form", "Zod", "PWA"],
    demoUrl: "https://example.com/booking",
    repoUrl: "https://github.com/example/clinic-booking",
  },
  {
    id: "atlas",
    featured: false,
    stack: ["React", "Radix UI", "Tailwind CSS", "Storybook"],
    repoUrl: "https://github.com/example/atlas-design-system",
  },
];
