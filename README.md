# Youth

## WebSocket Configuration

The application proxies WebSocket connections through Next.js so the browser can connect to the same origin that serves the app. Configure the following environment variables in production deployments:

- `WS_SERVICE_URL` – Absolute URL of the upstream WebSocket service (e.g. `wss://socket.example.com` or `http://localhost:8765`). This endpoint receives the upgraded connection from the rewrite defined in `next.config.mjs`.
- `NEXT_PUBLIC_WS_PATH` (optional) – Relative path on the Next.js app that should forward to the upstream service. Defaults to `/api/ws`.

When running locally, ensure `WS_SERVICE_URL` points to your WebSocket server so the built-in rewrite can proxy upgrade requests correctly.
