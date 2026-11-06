# QuantaEdge corporate website

A responsive corporate website for **QuantaEdge — Software Engineering & AI Solutions**.

## Stack

- Next.js App Router, React and TypeScript
- Motion for React for scroll, layout and interaction motion
- Lucide React icons
- Manrope display typography and Inter interface/body typography
- Shared CSS design tokens and responsive components
- Locally hosted vector artwork and no third-party UI kit

## Local development

Requirements: Node.js 22 or later and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Validation

```bash
npm run typecheck
npm run build
npm run test:e2e
```

GitHub Actions runs type-checking, a production build, desktop/tablet/mobile browser QA, Docker Compose validation, a production image build and an HTTP container smoke test on pushes and pull requests to main.

## Local Docker deployment with Cloudflare Tunnel

This repository deploys as **one stateless Next.js container**. It does not need the QuantaEdge Learning API, PostgreSQL or Redis. The Compose service binds to `127.0.0.1:13003` by default, so it is reachable from the local machine and a host-installed `cloudflared` service, not directly from the public internet.

### Windows PowerShell — build from the checkout

```powershell
git pull origin main
.\scripts\quantaedge-site.ps1 up -BuildLocal
.\scripts\quantaedge-site.ps1 health
.\scripts\quantaedge-site.ps1 logs
```

The script creates `.env` from `.env.example` on first run and never overwrites an existing `.env`. Edit it to configure Resend before expecting enquiries to be emailed. The site can start without Resend; the form will honestly report that email delivery is not configured and keep the brief copyable. For a local source build, `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_CONTACT_EMAIL` in `.env` are supplied as build arguments. These `NEXT_PUBLIC_*` values are embedded at build time; editing `.env` does not change an already-built GHCR image.

### Publish and run a versioned GHCR image

1. Open GitHub Actions and run **QuantaEdge Site Release** from the intended source branch.
2. Enter a version such as `v1.0.0`. The workflow builds the image and publishes version, commit-SHA and `latest` tags to `ghcr.io/manav326/quantaedge-site`.
3. Before publishing, optionally define the GitHub Actions repository variable `NEXT_PUBLIC_CONTACT_EMAIL` under Settings → Secrets and variables → Actions → Variables if the public email link should appear in the footer. This value is embedded in the image at build time. After the first package is published, open the package in GitHub Packages and set its visibility to **Public** if you want unauthenticated GHCR pulls. Otherwise, authenticate Docker on the local machine with a GitHub token that has `read:packages`.
4. Run the immutable version locally:

```powershell
.\scripts\quantaedge-site.ps1 up -ImageTag v1.0.0
```

To refresh the selected image and restart:

```powershell
.\scripts\quantaedge-site.ps1 rebuild -ImageTag v1.0.0
```

To roll back, start the previous known-good version explicitly, for example, replacing the sample with your previously deployed release:

```powershell
.\scripts\quantaedge-site.ps1 up -ImageTag v0.9.0
```

Useful actions:

```powershell
.\scripts\quantaedge-site.ps1 sync
.\scripts\quantaedge-site.ps1 ps
.\scripts\quantaedge-site.ps1 logs
.\scripts\quantaedge-site.ps1 down
```

Bash/Git Bash equivalents are available in `scripts/quantaedge-site.sh`. Use `--local` to build from source, `--tag v1.0.0` to select a release and `--port 13003` to override the host port. The PowerShell script accepts the equivalent `-BuildLocal`, `-ImageTag` and `-SitePort` parameters.

### Cloudflare Tunnel routes

Use the existing QuantaEdge Cloudflare Tunnel; do not create a second tunnel just for this website. Add these published-application hostnames in the existing tunnel:

| Public hostname | Origin service |
|---|---|
| `quantaedge.in` | `http://localhost:13003` |
| `www.quantaedge.in` | `http://localhost:13003` |

The local origin is HTTP because Cloudflare Tunnel provides the public HTTPS endpoint. Configure a Cloudflare redirect rule to send `www.quantaedge.in/*` to `https://quantaedge.in/$1` with a 301 or 308 redirect. If `cloudflared` runs inside Docker rather than as a Windows host service, do not assume `localhost:13003` reaches the host; use an origin address/network reachable from that tunnel container and keep the route restricted to the tunnel.

### Enquiry delivery and edge protection

Keep these values in the local `.env` only; never commit them or pass the Resend key to a browser build:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL` — verified sender in Resend
- `ENQUIRY_TO_EMAIL` — company inbox

Add a Cloudflare zone rate-limiting rule for URI path `/api/enquiry`, using IP as the counting characteristic, five requests per ten minutes and a ten-minute block. The existing application-side field validation, request-size bound, same-origin check and honeypot remain in place; Cloudflare provides the shared edge enforcement. Cloudflare's available expressions and rule counts depend on the zone plan.

### Operational notes

- There is no application database or uploaded customer file store in this website; the container has no persistent volume. Enquiry delivery goes to Resend only after the provider accepts it.
- Keep a secure backup of `.env` outside the repository. It contains deployment configuration and email credentials.
- Prefer immutable version tags for deployments. `latest` is a convenience tag, not a rollback reference.
- Cloudflare Tunnel routing, DNS, redirect rules and dashboard rate limits are configured in the Cloudflare account; the local script does not modify those account settings.
- The website remains available only while the Windows host, Docker Desktop and the existing tunnel connector are running.

## Enquiry delivery

The enquiry form validates and prepares a structured project brief. To deliver submissions to the company inbox, configure these **server-side** environment variables in the deployment platform:

- `RESEND_API_KEY` — Resend API key
- `RESEND_FROM_EMAIL` — verified sender address in Resend
- `ENQUIRY_TO_EMAIL` — company inbox that should receive enquiries

The browser never receives the Resend API key. Without all three variables, the form explicitly tells visitors that delivery is not configured and offers a copyable brief; it does not pretend that an enquiry was sent.

Optional:

- `NEXT_PUBLIC_SITE_URL` — canonical public site origin used for metadata and sitemap.
- `NEXT_PUBLIC_CONTACT_EMAIL` — optional public email link; set only after the address is confirmed.

See `.env.example`.

## Before public launch

1. Confirm the legal entity name, registered/contact details, canonical domain and company inbox.
2. Configure and test the Resend sender, recipient, API key and deployment secrets.
3. Confirm founder/team education claims and obtain required profile/image permissions.
4. Obtain permission for any partner/customer logos, quotes or case-study data. No fabricated reviews or customer outcomes are included.
5. Confirm each product's public status before publishing; the product cards disclose development and integration boundaries.
6. Complete legal review of the privacy notice and company-specific policies.
7. Verify Cloudflare edge rate limiting, monitoring and incident handling.

## Product truth policy

Product artwork is illustrative concept artwork, not application screenshots. Feature summaries are based on the current product repositories. They distinguish implemented workflows from regulatory, integration, acceptance and production-readiness gates. Do not convert roadmap items into customer-facing claims without fresh verification.
