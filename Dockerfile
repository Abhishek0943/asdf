# Step 1: Build frontend
FROM node:18-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# Step 2: Build backend and include frontend build
FROM node:18-alpine AS backend
WORKDIR /app

# Copy backend dependencies and build
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ .

# (Optional) If backend also needs a build step (e.g., TypeScript)
RUN npm run build || echo "No backend build step"

# --- FIX 1: Copy built frontend into backend public folder ---


# --- FIX 2: Set environment variables ---
ENV NODE_ENV=production
ENV PORT=3000

# --- Expose and run ---
EXPOSE 3000
CMD ["node", "dist/index.js"]
