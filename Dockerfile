# syntax=docker/dockerfile:1

# ---------------------------------------------------------------------------
# Production image for the Next.js portfolio.
# Three stages so dependency installation, compilation and the runtime layer
# cache independently and only the standalone server ships in the final image.
# ---------------------------------------------------------------------------
ARG NODE_VERSION=22-alpine

# --- Stage 1: dependencies -------------------------------------------------
FROM node:${NODE_VERSION} AS deps
WORKDIR /app

# Copying only the manifests keeps this layer cached until they change.
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# --- Stage 2: build --------------------------------------------------------
FROM node:${NODE_VERSION} AS builder
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Public env vars are inlined at build time, so they must be present here.
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# --- Stage 3: runtime ------------------------------------------------------
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# `output: "standalone"` emits a server bundle with only the used dependencies,
# so no npm install happens here and the image stays small.
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node

EXPOSE 3000

# The app has no external dependencies, so liveness and readiness are the same.
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/health').then(r=>{if(!r.ok)process.exitCode=1}).catch(()=>{process.exitCode=1})"

# Next registers SIGTERM/SIGINT handlers itself, so no init wrapper is needed
# for a clean shutdown; run the container with --init to reap orphan processes.
CMD ["node", "server.js"]
