# syntax=docker/dockerfile:1

FROM node:18-alpine3.16 AS builder
# Set working directory
WORKDIR /app
RUN yarn global add turbo@1.10.15 pnpm@8.1.0
COPY --link . .
RUN turbo prune --scope=bot --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:18-alpine3.16 AS installer
RUN apk update && apk add --update --no-cache curl libc6-compat openrc openssl1.1-compat-dev && \
    rm -rf /var/cache/apk/*
RUN yarn global add pnpm@8.1.0
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --link --from=builder /app/out/json/ .
COPY --link --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,target=/root/.local/share/pnpm/store/v3 \
    pnpm install --frozen-lockfile

# Build the project
COPY --link --from=builder /app/out/full/ .
COPY --link turbo.json turbo.json
COPY --link entrypoint.sh entrypoint.sh
RUN pnpm build --filter=bot...
ENTRYPOINT [ "/bin/sh", "entrypoint.sh" ]