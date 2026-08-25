import type { ComponentType, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/** Brand marks are not part of the Lucide set, so they live here as inline SVG. */
const baseProps = {
  viewBox: "0 0 24 24",
  fill: "currentColor",
  "aria-hidden": true,
  focusable: false,
} as const;

function GithubIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.5 3.17-1.18 3.17-1.18.63 1.58.24 2.75.12 3.04.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.2.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

function LinkedinIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

function TelegramIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <path d="M23.91 3.79 20.3 20.84c-.25 1.21-.98 1.5-1.99.94l-5.49-4.05-2.65 2.55c-.3.3-.55.55-1.12.55l.4-5.6 10.2-9.22c.44-.4-.1-.62-.68-.23L6.34 13.6.9 11.9c-1.18-.37-1.2-1.18.25-1.75l21.26-8.2c.98-.36 1.84.22 1.5 1.84Z" />
    </svg>
  );
}

export const socialIcons: Record<string, ComponentType<IconProps>> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  telegram: TelegramIcon,
};
