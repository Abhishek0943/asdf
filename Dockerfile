# ---------------------------
# 1) Build frontend (Vite)
# ---------------------------
FROM node:18-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# ---------------------------
# 2) Build backend (TypeScript)
#    - install dev deps (for tsc)
#    - build to dist/
#    - prune dev deps
# ---------------------------
FROM node:18-alpine AS backend-build
WORKDIR /app
COPY backend/package*.json ./
# install ALL deps (dev + prod) so tsc is available
RUN npm ci
COPY backend/ .
# compile TS -> dist/
RUN npm run build
# remove dev deps from node_modules to slim it down
RUN npm prune --omit=dev

# ---------------------------
# 3) Runtime image
#    - only prod node_modules + built dist
#    - copy frontend build to ./public
# ---------------------------
FROM node:18-alpine AS runtime
WORKDIR /app

# Copy runtime files from backend build
COPY --from=backend-build /app/package*.json ./
COPY --from=backend-build /app/node_modules ./node_modules
COPY --from=backend-build /app/dist ./dist
# If you also need non-TS runtime files (e.g., .env.example, prisma schema, etc.), copy them as needed

# Copy built frontend into public
COPY --from=frontend-build /frontend/dist ./public

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# If your compiled entry is dist/server.js:
CMD ["node", "dist/server.js"]
# If your app’s entry is still server.js (JS project), change to:
# CMD ["node", "server.js"]
