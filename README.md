# Lets Code Services

A monorepo for backend microservices, built with [Turborepo](https://turborepo.dev) and managed with [pnpm](https://pnpm.io).

## Project Structure

```
letscode-services/
├── apps/
│   ├── notification-service/   # Hono-based email notification service
│   └── video-service/          # Video service (in progress)
└── packages/
    ├── @letscode/services/     # Shared service integrations (MailTrap)
    ├── @letscode/databases/    # Shared Mongoose database models
    ├── @repo/ui/               # Shared React component library
    ├── @repo/eslint-config/    # Shared ESLint configurations
    └── @repo/typescript-config/ # Shared TypeScript configurations
```

## Apps

### `notification-service`
A [Hono](https://hono.dev) HTTP server for sending bulk email notifications. Runs on port `3000`.

- Exposes a `POST /bulkmail` endpoint for triggering bulk email dispatch
- Uses Node.js Worker Threads to offload processing
- Runs scheduled cron jobs via `node-cron`
- Integrates with MailTrap via `@letscode/services`

### `video-service`
Placeholder for the video processing service (work in progress).

## Packages

### `@letscode/services`
Shared service integrations.
- `MailTrapService` — email delivery via [Mailtrap](https://mailtrap.io)

Import: `import { MailTrapService } from "@letscode/services/service"`

### `@letscode/databases`
Shared [Mongoose](https://mongoosejs.com) schemas and models.

| Model | Description |
|---|---|
| `NotificationEvent` | Tracks notification events by topic |
| `Subscriber` | Stores email subscribers per topic |
| `Topics` | Manages available topics |
| `LogsEvent` | Event log records |

Import: `import { Subscriber, NotificationEvent } from "@letscode/databases/models"`

### `@repo/ui`
Stub React component library shared across apps (`Button`, `Card`, `Code`).

### `@repo/eslint-config`
Shared ESLint configs: `base`, `next`, `react-internal`.

### `@repo/typescript-config`
Shared `tsconfig.json` presets: `base`, `nextjs`, `react-library`.

## Prerequisites

- Node.js >= 18
- pnpm 9.x

## Getting Started

```sh
# Install dependencies
pnpm install

# Run all services in development mode
pnpm dev

# Build all packages and apps
pnpm build

# Run a specific service
pnpm dev --filter=notification-service
```

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start all apps in watch mode |
| `pnpm build` | Build all apps and packages |
| `pnpm lint` | Lint all packages |
| `pnpm format` | Format all `.ts`, `.tsx`, `.md` files with Prettier |
| `pnpm check-types` | Run TypeScript type checks across the monorepo |

## Tech Stack

- **Runtime**: Node.js (ESM)
- **HTTP Framework**: [Hono](https://hono.dev)
- **Build Orchestration**: [Turborepo](https://turborepo.dev)
- **Package Manager**: [pnpm](https://pnpm.io)
- **Language**: [TypeScript](https://www.typescriptlang.org)
- **Database ODM**: [Mongoose](https://mongoosejs.com)
- **Email**: [Mailtrap](https://mailtrap.io)
- **Scheduler**: [node-cron](https://github.com/kelektiv/node-cron)
