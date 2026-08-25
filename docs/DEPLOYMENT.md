# Deployment

## Prerequisites

- Node.js 20.9+ to build directly, or Docker to build an image.
- A reverse proxy terminating TLS in front of the container.

There are no secrets, no database and no external services to provision.

## Environment

| Variable               | Required | Default                 | Notes                                     |
| ---------------------- | -------- | ----------------------- | ----------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | No       | `http://localhost:3000` | Public origin. **Inlined at build time.** |
| `PORT`                 | No       | `3000`                  | Read at runtime by the standalone server. |
| `NODE_ENV`             | No       | `production` in image   | Set by the runtime stage.                 |

`NEXT_PUBLIC_SITE_URL` is a build input, not a runtime one. Changing it means rebuilding —
`compose.yaml` passes it as a build argument for exactly that reason. It feeds canonical URLs,
`sitemap.xml` and social metadata, so set it to the real origin before building for production.

`src/config/env.ts` validates the values at startup and throws with a readable message if
`NEXT_PUBLIC_SITE_URL` is not a valid URL, which fails the build rather than shipping broken
metadata.

## Build without Docker

```bash
npm ci
```

```bash
NEXT_PUBLIC_SITE_URL=https://example.com npm run build
```

```bash
npm start
```

`next.config.ts` sets `output: "standalone"`, so `.next/standalone` contains a self-contained
server. To deploy the artifact rather than the repository, copy `.next/standalone`,
`.next/static` and `public/`, then run `node server.js`.

## Docker

```bash
docker compose up --build
```

Or directly:

```bash
docker build --build-arg NEXT_PUBLIC_SITE_URL=https://example.com -t portfolio .
```

```bash
docker run --init -p 3000:3000 portfolio
```

### Image

Three stages, so dependency install, compilation and runtime cache independently:

1. **deps** — `npm ci` against the manifests alone, so the layer survives source edits.
2. **builder** — compiles with the public origin baked in.
3. **runner** — copies only `public/`, `.next/standalone` and `.next/static`. No `npm install`
   runs here and no source, tests or dev dependencies reach the final image.

Runtime hardening:

- Runs as the built-in non-root `node` user; copied files are owned by it.
- `HEALTHCHECK` calls `/api/health` with Node's global `fetch` (no curl in the image).
- Next.js registers its own `SIGTERM`/`SIGINT` handlers, so shutdown is graceful without a
  custom server. Run with `--init` (or `init: true` in compose) so orphaned processes are
  reaped.
- `.dockerignore` keeps `.git`, `node_modules`, `.next`, docs and any `.env` out of the build
  context.

### Compose

`compose.yaml` defines the one service the app needs. It publishes to `127.0.0.1:3000` rather
than `0.0.0.0`, expecting a reverse proxy in front, and sets `restart: unless-stopped`, a
health check, `no-new-privileges`, `cap_drop: ALL`, a 512 MB memory limit and log rotation.

No database, cache or queue service is defined, because the application uses none.

## Reverse proxy

The app sets `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
`Permissions-Policy` and a CSP covering `frame-ancestors`, `base-uri`, `form-action` and
`object-src`. Two things are left to the proxy because they depend on infrastructure the
repository does not own:

- `Strict-Transport-Security`, which needs a real certificate and a considered max-age.
- A full `script-src` CSP, which needs a nonce coordinated with the framework's inline runtime.

Forward `X-Forwarded-For` so the authorization endpoint's rate limiter can distinguish clients.

## Health checks

| Path          | Purpose                                                                               |
| ------------- | ------------------------------------------------------------------------------------- |
| `/api/health` | Liveness and readiness (they are the same here — the app has no dependencies to warm) |

Returns `200` with `{ status, uptimeSeconds, timestamp }` and `Cache-Control: no-store`.

## Scaling

The application is stateless: every page is prerendered and the wallet lives in the visitor's
browser, so instances can be added freely behind a load balancer without sticky sessions.

The one caveat is the authorization rate limiter, which is per-process. Across N instances the
effective limit is N × 12 per minute. Moving it to a shared store is a change inside
`src/lib/rate-limit.ts`; no call site changes.

## Logging

Logs go to stdout as single-line JSON with a level, message and timestamp. Only scalar,
non-sensitive metadata is included — no card details, no request bodies, no stack traces.
Compose rotates them at 10 MB × 3 files; a platform log driver can replace that.
