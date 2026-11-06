FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json ./
RUN npm install --no-audit --no-fund

COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ARG NEXT_PUBLIC_SITE_URL=https://quantaedge.in
ARG NEXT_PUBLIC_CONTACT_EMAIL=""
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_PUBLIC_CONTACT_EMAIL=${NEXT_PUBLIC_CONTACT_EMAIL}

RUN npm run typecheck && npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -S -g 10001 quantaedge \
    && adduser -S -u 10001 -G quantaedge quantaedge

COPY --from=builder --chown=quantaedge:quantaedge /app/package.json ./package.json
COPY --from=builder --chown=quantaedge:quantaedge /app/node_modules ./node_modules
COPY --from=builder --chown=quantaedge:quantaedge /app/.next ./.next
COPY --from=builder --chown=quantaedge:quantaedge /app/public ./public
COPY --from=builder --chown=quantaedge:quantaedge /app/next.config.ts ./next.config.ts

USER quantaedge
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=25s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["npm", "run", "start", "--", "--hostname", "0.0.0.0", "--port", "3000"]
