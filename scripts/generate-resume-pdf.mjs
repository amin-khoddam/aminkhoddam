/**
 * Generates the placeholder resume PDF served by the paid download flow.
 *
 * Written by hand rather than with a PDF library so the repository does not
 * carry a dependency for a single static asset. Run with:
 *   node scripts/generate-resume-pdf.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const OUTPUT = path.join("public", "resume", "amin-khoddam-frontend-resume.pdf");

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;
const MARGIN = 56;

/** [text, fontKey, size, spaceBefore] */
const LINES = [
  ["Amin Khoddam", "F1", 24, 0],
  ["Frontend Developer  |  Tehran, Iran", "F2", 11, 8],
  ["hello@example.com  |  +98 912 000 0000  |  github.com/example", "F2", 10, 4],
  ["PLACEHOLDER RESUME - replace before publishing.", "F2", 9, 10],

  ["PROFILE", "F1", 12, 26],
  ["Frontend developer with 3 years of experience building production React and", "F2", 10, 8],
  [
    "Next.js interfaces, design systems, and fintech-grade flows in Persian and English.",
    "F2",
    10,
    2,
  ],

  ["CORE SKILLS", "F1", 12, 22],
  ["React  -  Next.js  -  TypeScript  -  Tailwind CSS  -  shadcn/ui", "F2", 10, 8],
  ["Zustand  -  TanStack Query  -  React Hook Form  -  Zod  -  Framer Motion", "F2", 10, 2],
  ["Vitest  -  ESLint  -  Docker  -  GitHub Actions  -  Accessibility  -  RTL", "F2", 10, 2],

  ["EXPERIENCE", "F1", 12, 22],
  ["Frontend Developer, Nikan Pay", "F1", 10, 8],
  ["Mar 2025 - Present", "F2", 9, 2],
  ["Owns the wallet and payment surfaces of a consumer fintech app.", "F2", 10, 4],

  ["Frontend Developer, Radmehr Studio", "F1", 10, 12],
  ["Jun 2024 - Feb 2025", "F2", 9, 2],
  ["Built client web products end to end, from design handoff to release.", "F2", 10, 4],

  ["Junior Frontend Developer, Parsa Web", "F1", 10, 12],
  ["Aug 2023 - May 2024", "F2", 9, 2],
  ["Turned designs into responsive, tested React interfaces.", "F2", 10, 4],

  ["SELECTED PROJECTS", "F1", 12, 22],
  ["Wallet & Payments Demo - balance, validated top-up and withdrawal sheets,", "F2", 10, 8],
  ["a simulated gateway and a persisted transaction history.", "F2", 10, 2],
  ["Atlas Design System - internal component library with tokens and RTL primitives.", "F2", 10, 6],
];

function escapePdfText(value) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildContentStream() {
  const parts = ["BT"];
  let cursorY = PAGE_HEIGHT - MARGIN;

  for (const [text, font, size, spaceBefore] of LINES) {
    cursorY -= size + spaceBefore;
    parts.push(`/${font} ${size} Tf`);
    parts.push(`1 0 0 1 ${MARGIN} ${cursorY} Tm`);
    parts.push(`(${escapePdfText(text)}) Tj`);
  }

  parts.push("ET");
  return parts.join("\n");
}

function buildPdf() {
  const content = buildContentStream();
  const contentLength = Buffer.byteLength(content, "latin1");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] ` +
      "/Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${contentLength} >>\nstream\n${content}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [];

  objects.forEach((body, index) => {
    offsets.push(Buffer.byteLength(pdf, "latin1"));
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(pdf, "latin1");
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets) {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(pdf, "latin1");
}

await mkdir(path.dirname(OUTPUT), { recursive: true });
await writeFile(OUTPUT, buildPdf());
console.log(`Wrote ${OUTPUT}`);
