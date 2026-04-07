# notification-service

A [Hono](https://hono.dev)-based HTTP microservice for sending bulk email notifications. Uses Node.js Worker Threads for background processing and `node-cron` for scheduled jobs.

## Structure

```
notification-service/
└── src/
    ├── index.ts          # HTTP server entry point (Hono app)
    ├── crons/
    │   └── cron.ts       # Cron job scheduler wrapper (node-cron)
    └── worker/
        ├── worker.ts     # Worker thread spawner
        └── thread.ts     # Worker thread entry point (runs cron jobs)
```

## API

| Method | Path | Description |
|---|---|---|
| `GET` | `/` | Health check — returns `{ message: "healthy" }` |
| `POST` | `/bulkmail` | Trigger bulk email dispatch for a topic |

## Development

```sh
pnpm dev
```

Starts the server with `tsx watch` on `http://localhost:3000`.

## Build & Run

```sh
pnpm build   # Compiles TypeScript to dist/
pnpm start   # Runs the compiled output
```

## Dependencies

| Package | Purpose |
|---|---|
| `hono` | HTTP framework |
| `@hono/node-server` | Node.js adapter for Hono |
| `node-cron` | Cron job scheduling |
| `@letscode/services` | MailTrap email integration |
