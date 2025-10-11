FROM node:18-alpine AS builder
WORKDIR /app
COPY backend ./backend
COPY frontend ./frontend


WORKDIR /app/backend
RUN npm install
RUN npm run build


WORKDIR /app/frontend
RUN npm install
RUN npm run build


FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/backend /app/backend
COPY --from=builder /app/frontend /app/frontend
WORKDIR /app/backend
RUN npm install --omit=dev

ENV NODE_ENV=production
ENV DB_URI_PRO=mongodb+srv://abhishke:dvAFNVlxGaBin0dy@cluster0.bp6mr6f.mongodb.net/assiment
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/index.js"]