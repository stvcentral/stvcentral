FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:24-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0 NEXT_TELEMETRY_DISABLED=1 CUSTOMER_DB_PATH=/app/runtime/customers.sqlite MUSIC_DIR=/app/private/music
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/private/music ./private/music
COPY --from=build --chown=node:node /app/scripts ./scripts
RUN mkdir -p /app/runtime && chown node:node /app/runtime
USER node
EXPOSE 3000
CMD ["node","server.js"]
