FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install 
# RUN yarn install --frozen-lockfile

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG MONGODB_URI
ENV MONGODB_URI $MONGODB_URI

ENV NEXT_TELEMETRY_DISABLED 1
RUN yarn build

# Prepare the final image
FROM base AS runner
WORKDIR /app

# Set production environment variables
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# Copy built assets and dependencies
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Set permissions and user
USER nextjs

# Expose the port for Cloud Run
EXPOSE 3000
ENV PORT 3000

# Start the application (both frontend and backend)

CMD ["yarn", "start"]

