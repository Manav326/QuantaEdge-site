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
```

GitHub Actions runs both commands on pushes and pull requests to main.

## Enquiry delivery

The enquiry form validates and prepares a structured project brief. To deliver submissions to the company inbox, configure these **server-side** environment variables in the deployment platform:

- `RESEND_API_KEY` — Resend API key
- `RESEND_FROM_EMAIL` — verified sender address in Resend
- `ENQUIRY_TO_EMAIL` — company inbox that should receive enquiries

The browser never receives the Resend API key. Without all three variables, the form explicitly tells visitors that delivery is not configured and offers a copyable brief; it does not pretend that an enquiry was sent.

Optional:

- `NEXT_PUBLIC_SITE_URL` — confirmed canonical public site origin used for metadata and sitemap. It is intentionally not guessed.
- `NEXT_PUBLIC_CONTACT_EMAIL` — optional public email link; set only after the address is confirmed.

See `.env.example`.

## Before public launch

1. Confirm the legal entity name, registered/contact details, canonical domain and company inbox.
2. Configure and test the Resend sender, recipient, API key and deployment secrets.
3. Confirm founder/team education claims and obtain required profile/image permissions.
4. Obtain permission for any partner/customer logos, quotes or case-study data. No fabricated reviews or customer outcomes are included.
5. Confirm each product's public status before publishing; the product cards disclose development and integration boundaries.
6. Complete legal review of the privacy notice and company-specific policies.
7. Add deployment-level WAF/rate limiting, monitoring and incident handling. The public enquiry route has input bounds and a honeypot but still needs edge-level abuse controls.

## Product truth policy

Product artwork is illustrative concept artwork, not application screenshots. Feature summaries are based on the current product repositories. They distinguish implemented workflows from regulatory, integration, acceptance and production-readiness gates. Do not convert roadmap items into customer-facing claims without fresh verification.
