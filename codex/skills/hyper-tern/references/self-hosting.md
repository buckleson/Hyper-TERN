# Hyper-Tern Self-Hosting Reference

Install directory defaults to `~/Hyper-Tern`.

Health endpoint:

```bash
curl -sSf http://localhost:2099/api/v1/health
```

Useful commands from the install directory:

```bash
docker compose ps
docker compose logs -f hyper-tern
docker compose pull
docker compose up -d
docker compose down
docker compose down -v
```

Core environment variables:

- `BETTER_AUTH_SECRET`: required 32+ character secret.
- `HYPER_TERN_ENCRYPTION_KEY`: optional separate 32+ character secret for stored provider credentials.
- `BETTER_AUTH_URL`: public URL used for auth callbacks and emails.
- `PORT`: host/app port, defaults to `2099`.
- `HYPER_TERN_TELEMETRY_DISABLED=1`: opt out of anonymous aggregate telemetry.
- `HYPER_TERN_MODE=selfhosted`: self-hosted routing semantics; the bundled Docker compose sets this.

Local LLM providers from Docker should use `host.docker.internal`, for example `http://host.docker.internal:11434/v1`.
