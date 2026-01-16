# --- Stage 1: Install Dependencies ---
FROM node:20-alpine AS deps
WORKDIR /app

# Copy package.json & package-lock.json
COPY package.json package-lock.json ./

# Install dependencies (gunakan npm ci untuk clean install)
RUN npm ci

# --- Stage 2: Build Application ---
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# --- TAMBAHAN PENTING ---
# Terima ARG dari docker-compose
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG MAILJET_API_KEY
ARG MAILJET_SECRET_KEY
ARG NEXT_PUBLIC_EMAIL

# Set sebagai ENV agar terbaca saat 'npm run build'
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV MAILJET_API_KEY=$MAILJET_API_KEY
ENV MAILJET_SECRET_KEY=$MAILJET_SECRET_KEY
ENV NEXT_PUBLIC_EMAIL=$NEXT_PUBLIC_EMAIL
# ------------------------

# Build Next.js
# Note: NEXT_PUBLIC_ variables harus ada saat build time jika digunakan di static pages.
# Jika kamu menggunakan env variabel saat build, kamu bisa menambahkannya di sini atau via build-arg.
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# --- Stage 3: Production Runner ---
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Buat user non-root untuk keamanan
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy file public (aset statis)
COPY --from=builder /app/public ./public

# Copy folder .next/standalone (hasil build yang sudah dioptimasi)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# Copy folder .next/static (untuk CSS/JS client side)
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# 'server.js' otomatis dibuat oleh Next.js mode standalone
CMD ["node", "server.js"]