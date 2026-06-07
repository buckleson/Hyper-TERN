<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/TheHyper-TERN/hyper-tern/HEAD/.github/assets/logo-white.svg" />
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/TheHyper-TERN/hyper-tern/HEAD/.github/assets/logo-dark.svg" />
    <img src="https://raw.githubusercontent.com/TheHyper-TERN/hyper-tern/HEAD/.github/assets/logo-dark.svg" alt="Hyper-Tern" height="53" title="Hyper-Tern"/>
  </picture>
</p>
<p align="center">
  <a href="https://hub.docker.com/r/hypertern/hyper-tern"><img src="https://img.shields.io/docker/pulls/hypertern/hyper-tern?color=2496ED&label=docker%20pulls" alt="Docker pulls" /></a>
  &nbsp;
  <a href="https://github.com/TheHyper-TERN/hyper-tern/stargazers"><img src="https://img.shields.io/github/stars/TheHyper-TERN/hyper-tern?style=flat" alt="GitHub stars" /></a>
  &nbsp;
  <a href="https://github.com/TheHyper-TERN/hyper-tern/blob/main/LICENSE"><img src="https://img.shields.io/github/license/TheHyper-TERN/hyper-tern?color=blue" alt="license" /></a>
  &nbsp;
  <a href="https://discord.gg/FepAked3W7"><img src="https://img.shields.io/badge/Discord-Join-5865F2?logo=discord&logoColor=white" alt="Discord" /></a>
</p>

## What is Hyper-Tern?

Hyper-Tern is a smart model router for **AI agents** like OpenClaw, Hermes, or anything speaking the OpenAI-compatible HTTP API. It sits between your agent and your LLM providers, scores each request, and routes it to the cheapest model that can handle it.

Think of it as the practical combination of OpenRouter-style model access and LiteLLM-style gateway control: one endpoint for cloud providers, subscriptions, custom OpenAI-compatible APIs, and local inference servers, with a dashboard that shows every dollar.

- Route requests to the right model and cut waste on routine calls
- Use local inference for basic tasks through Ollama, LM Studio, llama.cpp, vLLM, or any OpenAI-compatible local server
- Manage context across tenants, agents, messages, routing tiers, routing reasons, providers, and fallbacks
- Fallback to other models/providers when a query fails
- Track every dollar, token, message, provider, agent, and saving
- Set notifications and limits before usage gets expensive
- Self-host: your requests, your providers, your data

![Hyper-Tern-gh](https://raw.githubusercontent.com/TheHyper-TERN/hyper-tern/HEAD/.github/assets/hyper-tern-screenshot.png)

## Table of contents

- [Supported providers](#supported-providers)
- [Hyper-Tern vs OpenRouter and LiteLLM](#hyper-tern-vs-openrouter-and-litellm)
- [Installation](#installation)
  - [Option 1: Quickstart install script (recommended)](#option-1-quickstart-install-script-recommended)
  - [AI-assisted install](#ai-assisted-install)
  - [Option 2: Docker Compose (manual)](#option-2-docker-compose-manual)
  - [Option 3: Docker Run (bring your own PostgreSQL)](#option-3-docker-run-bring-your-own-postgresql)
  - [Verifying the image signature](#verifying-the-image-signature)
  - [Custom port](#custom-port)
- [Image tags](#image-tags)
- [Upgrading](#upgrading)
- [Backup & persistence](#backup--persistence)
- [Connecting local LLM servers](#connecting-local-llm-servers)
- [Environment variables](#environment-variables)
- [Links](#links)

## Supported providers

Works with 300+ models across OpenAI, Anthropic, Google Gemini, DeepSeek, xAI, Mistral, Qwen, MiniMax, Kimi, Amazon Nova, Z.ai, OpenRouter, Ollama, and any provider with an OpenAI-compatible API. Connect with an API key, or reuse an existing paid subscription (ChatGPT Plus/Pro, Claude Max/Pro, Kimi Coding Plan, GLM Coding Plan, etc.) where supported.

## Hyper-Tern vs OpenRouter and LiteLLM

|              | Hyper-Tern                                          | OpenRouter / LiteLLM-style alternatives              |
| ------------ | --------------------------------------------------- | ----------------------------------------------------- |
| Architecture | Your Hyper-Tern instance forwards to your providers | Often cloud proxy, library gateway, or bring-your-own control plane |
| Routing      | Cost-aware scoring, tiers, specificity, local inference, fallbacks | Usually model catalog access or programmable gateway primitives |
| Cost         | Self-hosted app, no per-call platform markup        | OpenRouter adds a platform fee; gateway libraries still need your own product layer |
| Source code  | MIT, fully open                                     | Mixed: proprietary services or open libraries         |
| Data privacy | Self-hosted, no middleman                           | Depends on the service or gateway you operate         |
| Visibility   | See routing reasons, messages, tokens, costs, savings, limits, and notifications | Often requires extra observability plumbing           |

---

## Installation

Three paths, ordered from fastest to most hands-on. All three end in the same place: a running stack at [http://localhost:2099](http://localhost:2099) where you sign up. The first account you create becomes the admin. No demo credentials are pre-seeded.

> **Heads up on network binding.** The bundled compose file binds port 2099 to `127.0.0.1` only, so the dashboard is reachable on the host machine but not over the LAN. See [Custom port](#custom-port) to expose it beyond localhost.

### Option 1: Quickstart install script (recommended)

One command. The installer downloads the compose file, generates a secret, and brings up the stack. Give it about 30 seconds to boot.

```bash
bash <(curl -sSL https://raw.githubusercontent.com/TheHyper-TERN/hyper-tern/main/docker/install.sh)
```

Windows PowerShell:

```powershell
irm https://raw.githubusercontent.com/TheHyper-TERN/hyper-tern/main/docker/install.ps1 | iex
```

<details>
<summary><strong>Prefer to review the script before running it?</strong></summary>

Download the script:

```bash
curl -sSLO https://raw.githubusercontent.com/TheHyper-TERN/hyper-tern/main/docker/install.sh
```

Review it (optional):

```bash
less install.sh
```

Run it:

```bash
bash install.sh
```

</details>

Useful flags: `--dir <path>` to install elsewhere, `--dry-run` to preview, `--yes` to skip the confirmation prompt.

### AI-assisted install

This repo ships a Codex skill at `.codex/skills/hyper-tern-installer/SKILL.md`. Give that skill to an AI coding agent and ask:

```text
Use the Hyper-Tern installer skill to install Hyper-Tern on this machine.
```

The skill lets the agent pick the right one-line command for the OS, verify Docker Compose, run a dry run when useful, start the stack, connect local inference providers, and confirm `http://localhost:2099/api/v1/health`.

### Option 2: Docker Compose (manual)

Same underlying flow as the install script, but you drive it yourself so you can edit the config before booting the stack.

1. Download the compose file and the env template into the same directory:

```bash
curl -O https://raw.githubusercontent.com/TheHyper-TERN/hyper-tern/main/docker/docker-compose.yml
curl -O https://raw.githubusercontent.com/TheHyper-TERN/hyper-tern/main/docker/.env.example
cp .env.example .env
```

2. Open `.env` in your editor and set `BETTER_AUTH_SECRET` to a random string. You can generate one with:

```bash
openssl rand -hex 32
```

(Optional: to use a stronger database password, set BOTH `POSTGRES_PASSWORD` and `DATABASE_URL` in `.env`, they must agree, and any special characters in the password need to be percent-encoded in the URL.)

3. Start the stack:

```bash
docker compose up -d
```

Give it about 30 seconds to boot.

4. Open [http://localhost:2099](http://localhost:2099) and sign up. The first account you create becomes the admin.

To stop:

```bash
docker compose down       # keeps data
docker compose down -v    # deletes everything
```

### Option 3: Docker Run (bring your own PostgreSQL)

If you already have PostgreSQL running, replace `user`, `pass`, and `host` with your actual database credentials, then run this in your terminal:

<details open>
<summary><strong>macOS / Linux (bash, zsh)</strong></summary>

```bash
docker run -d \
  -p 2099:2099 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/hyper-tern \
  -e BETTER_AUTH_SECRET=$(openssl rand -hex 32) \
  -e BETTER_AUTH_URL=http://localhost:2099 \
  hypertern/hyper-tern
```

</details>

<details>
<summary><strong>Windows (PowerShell)</strong></summary>

```powershell
$secret = -join ((48..57 + 97..122) | Get-Random -Count 64 | ForEach-Object { [char]$_ })

docker run -d `
  -p 2099:2099 `
  -e DATABASE_URL=postgresql://user:pass@host:5432/hyper-tern `
  -e BETTER_AUTH_SECRET=$secret `
  -e BETTER_AUTH_URL=http://localhost:2099 `
  hypertern/hyper-tern
```

</details>

<details>
<summary><strong>Windows (CMD)</strong></summary>

Generate a 64-character hex secret with any tool you trust, then:

```cmd
docker run -d ^
  -p 2099:2099 ^
  -e DATABASE_URL=postgresql://user:pass@host:5432/hyper-tern ^
  -e BETTER_AUTH_SECRET=<your-64-char-secret> ^
  -e BETTER_AUTH_URL=http://localhost:2099 ^
  hypertern/hyper-tern
```

</details>

TypeORM migrations run automatically on every boot — fresh installs come up with the schema in place. Then visit [http://localhost:2099](http://localhost:2099) and complete the setup wizard to create your admin account.

### Verifying the image signature

Published images are signed with cosign keyless signing (Sigstore). Verify before pulling:

```bash
cosign verify hypertern/hyper-tern:<version> \
  --certificate-identity-regexp="^https://github.com/TheHyper-TERN/hyper-tern/" \
  --certificate-oidc-issuer="https://token.actions.githubusercontent.com"
```

### Custom port

If port 2099 is taken, change both the mapping and `BETTER_AUTH_URL`:

```bash
docker run -d \
  -p 8080:2099 \
  -e BETTER_AUTH_URL=http://localhost:8080 \
  ...
```

Or in docker-compose.yml:

```yaml
ports:
  - '127.0.0.1:8080:2099'
```

…and in `.env`:

```env
BETTER_AUTH_URL=http://localhost:8080
```

### Exposing on the LAN

By default the compose file binds port `2099` to `127.0.0.1` only. The dashboard is reachable from the host but not from other machines on the network. To expose it on the LAN:

1. Edit `docker-compose.yml` and change the `ports` line from `"127.0.0.1:2099:2099"` to `"2099:2099"`.
2. In `.env`, set `BETTER_AUTH_URL` to the host you'll reach the dashboard on, e.g. `http://192.168.1.20:2099` or `https://hyper-tern.mydomain.com`. This MUST match the URL in the browser or Better Auth will reject the login with "Invalid origin".
3. `docker compose up -d` to apply.

If you see "Invalid origin" on the login page, `BETTER_AUTH_URL` doesn't match the URL you're accessing the dashboard on. The host matters as much as the port.

If the dashboard loads as a **blank page on a LAN IP on an older image**, pull the latest image (`docker compose pull && docker compose up -d`). Older builds emitted an `upgrade-insecure-requests` CSP directive that made browsers rewrite `/assets/*.js` to HTTPS on private-IP hosts (10.x / 172.16-31.x / 192.168.x), which the server doesn't serve — the JS bundle failed to load and the page never mounted. This directive has been removed.

## Image tags

Every release is published with the following tags:

- `{major}.{minor}.{patch}` - fully pinned (e.g. `5.46.0`)
- `{major}.{minor}` - latest patch within a minor (e.g. `5.46`)
- `{major}` - latest minor+patch within a major (e.g. `5`)
- `latest` - latest stable release
- `sha-<short>` - exact commit for rollback

Images are built for both `linux/amd64` and `linux/arm64`.

## Upgrading

Hyper-Tern ships a new image on every release. To upgrade an existing compose install:

```bash
docker compose pull
docker compose up -d
```

Database migrations run automatically on boot, no manual steps. Your data in the `pgdata` volume is preserved across upgrades. Pin to a specific major version (e.g. `hypertern/hyper-tern:5`) in `docker-compose.yml` if you want control over when major upgrades happen.

## Backup & persistence

All state lives in the `pgdata` named volume mounted at `/var/lib/postgresql/data` in the `postgres` service. Nothing else in the Hyper-Tern container is stateful.

**Back up** (from the host, with the stack running):

```bash
docker compose exec -T postgres pg_dump -U hyper_tern hyper_tern > hyper-tern-backup-$(date +%F).sql
```

**Restore** into a fresh stack:

```bash
docker compose up -d postgres
cat hyper-tern-backup-2026-04-12.sql | docker compose exec -T postgres psql -U hyper_tern hyper_tern
docker compose up -d
```

To list / remove the volume manually:

```bash
docker volume ls | grep pgdata
docker compose down -v    # ⚠  destroys all data
```

## Connecting local LLM servers

The self-hosted Hyper-Tern container can reach any OpenAI-compatible server running on your host via `host.docker.internal:<port>`. This works on Docker Desktop (macOS/Windows) out of the box, and on Linux with Docker Engine 20.10 or later.

Because the container detects self-hosted mode automatically (via `/.dockerenv`), it lets you add custom providers with `http://` and private/loopback URLs — cloud-metadata endpoints (169.254.169.254, etc.) stay blocked.

### Ollama (built-in tile)

1. Install Ollama from [ollama.com](https://ollama.com) and pull a model:

```bash
ollama pull llama3.1:8b
```

2. In the dashboard, go to Providers → API Keys → click the **Ollama** tile.
3. Hyper-Tern reaches Ollama at `http://host.docker.internal:11434` and syncs the available models.

### LM Studio

1. Install LM Studio from https://lmstudio.ai, load at least one chat model, and start the local server. **Bind to `0.0.0.0`** so the Hyper-Tern container can reach it:
   - GUI: Developer tab → enable "Serve on Local Network" (LM Studio persists this across restarts).
   - CLI: `lms server start --bind 0.0.0.0 --port 1234 --cors`
2. Providers → API Keys → click the **LM Studio** tile.
3. Hyper-Tern probes `http://host.docker.internal:1234/v1`, discovers your loaded models, and connects them in one click.

### llama.cpp

1. Build `llama-server` from the [ggml-org/llama.cpp](https://github.com/ggml-org/llama.cpp) repo (or grab a release binary), then start it with a GGUF model bound to `0.0.0.0` so the Hyper-Tern container can reach it:

   ```bash
   ./llama-server -m models/llama-3.1-8b-instruct.Q4_K_M.gguf --host 0.0.0.0 --port 8080
   ```

   `llama-server` only listens on `0.0.0.0` if you pass `--host 0.0.0.0`; the default bind isn't reachable from Docker.

2. Providers → API Keys → click the **llama.cpp** tile.
3. Hyper-Tern probes `http://host.docker.internal:8080/v1`, lists the model your server loaded, and connects it in one click. Pre-b3800 builds that don't expose `/v1/models` get a hint to upgrade or fall back to **Add custom provider**.

### Any other OpenAI-compatible server

For vLLM, text-generation-webui, TogetherAI proxies, Azure OpenAI gateways, or anything else that speaks OpenAI's HTTP API:

1. Start your server on the host bound to `0.0.0.0`.
2. Providers → API Keys → **Add custom provider** → type the URL (e.g. `http://host.docker.internal:8000/v1`).
3. Click **Fetch models** to auto-populate the model list from the server's `/v1/models` endpoint.

### Running Ollama on another machine

If Ollama runs on a different host on your LAN, set `OLLAMA_HOST` in `.env` to the full URL (e.g. `http://192.168.1.20:11434`) and restart the stack. Private IPs are allowed in the self-hosted version.

### Podman / rootless containers

Podman doesn't ship `/.dockerenv` or `host.docker.internal`. Hyper-Tern still
auto-detects Podman via `/run/.containerenv` and treats the install as
self-hosted, but the canonical hostname for reaching the host from inside
a Podman container is `host.containers.internal` (Podman 4+ exposes this
by default; older versions need `--add-host=host.containers.internal:host-gateway`).
If you run Hyper-Tern as one Podman service and your LLM server (llama.cpp,
Ollama, etc.) as another, point Hyper-Tern at the service name on the shared
network — e.g. `http://llamacpp:8080/v1` — and **Add custom provider** will
accept it as long as `HYPER_TERN_MODE=selfhosted` (the bundled compose file
sets this automatically).

## Environment variables

| Variable             | Required | Default                 | Description                                   |
| -------------------- | -------- | ----------------------- | --------------------------------------------- |
| `DATABASE_URL`       | Yes      | --                      | PostgreSQL connection string                  |
| `BETTER_AUTH_SECRET` | Yes      | --                      | Session signing secret (min 32 chars)         |
| `BETTER_AUTH_URL`    | No       | `http://localhost:2099` | Public URL. Set this when using a custom port |
| `PORT`               | No       | `2099`                  | Internal server port                          |
| `NODE_ENV`           | No       | `production`            | Runtime mode. Leave as `production` for Docker |
| `SEED_DATA`          | No       | `false`                 | Seed demo data on startup                     |
| `OLLAMA_HOST`        | No       | `http://host.docker.internal:11434` | Ollama endpoint for the built-in tile. Override to point at a LAN-hosted Ollama. |
| `HYPER_TERN_MODE`      | No       | auto (Docker → selfhosted) | `selfhosted` or `cloud`. `local` is a legacy alias. Self-hosted mode allows private/http URLs for custom providers. |
| `HYPER_TERN_TELEMETRY_DISABLED` | No | `0`               | Set `1` to disable anonymous usage telemetry  |

Full env var reference: [github.com/TheHyper-TERN/hyper-tern](https://github.com/TheHyper-TERN/hyper-tern)

## Anonymous usage telemetry

Hyper-Tern sends a small anonymous usage report once per 24h so the maintainers
can see how the project is being used. Aggregates only — no prompts, no
message contents, no API keys, nothing that identifies a user. The report is
a random install UUID (generated once, no PII), the Hyper-Tern version, and
aggregate counters grouped by provider, routing tier, auth type, agent
platform, OS, and arch.

To disable, set `HYPER_TERN_TELEMETRY_DISABLED=1` in your `.env` file and
restart the container. The full field list is published at
[hyper-tern.build/docs/self-hosted#telemetry](https://hyper-tern.build/docs/self-hosted#telemetry).

## Links

- [GitHub](https://github.com/TheHyper-TERN/hyper-tern)
- [Website](https://hyper-tern.build)
- [Docs](https://hyper-tern.build/docs)
- [Discord](https://discord.gg/FepAked3W7)

## License

[MIT](https://github.com/TheHyper-TERN/hyper-tern/blob/main/LICENSE)
