# ---------- Build stage ----------
FROM node:24.13.0-alpine AS builder

WORKDIR /app

# Install deps first (better cache)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build


# ---------- Runtime stage ----------
FROM node:24.13.0-alpine AS runner

WORKDIR /app

# Copy standalone server (includes minimal node_modules)
COPY --from=builder /app/.next/standalone ./

# Copy static assets
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

RUN find /app/.next/standalone -type f -name ".env*" -delete || true

# EXPOSE
EXPOSE 3000

CMD ["node", "server.js"]
