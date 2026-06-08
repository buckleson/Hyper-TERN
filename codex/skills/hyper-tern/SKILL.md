---
name: hyper-tern
description: Use when a user asks an AI agent to install, verify, configure, upgrade, or troubleshoot Hyper-Tern self-hosted with Docker, or when they ask for the one-command installer for Hyper-Tern.
---

# Hyper-Tern

## Overview

Hyper-Tern is a self-hosted AI model router and observability dashboard. This skill gives an agent the exact install, verification, and troubleshooting path for users who want Hyper-Tern running locally.

## Quick Install

Prefer Docker. Confirm Docker is installed, then choose the platform-specific one-liner:

```bash
bash <(curl -sSL https://raw.githubusercontent.com/buckleson/Hyper-TERN/main/docker/install.sh)
```

```powershell
irm https://raw.githubusercontent.com/buckleson/Hyper-TERN/main/docker/install.ps1 | iex
```

The installer creates `~/Hyper-Tern`, downloads `docker-compose.yml` and `.env`, generates `BETTER_AUTH_SECRET`, starts the stack, and waits for `http://localhost:2099/api/v1/health`.

## Agent Workflow

1. Check prerequisites: Docker Engine/Desktop with Compose v2, internet access to GitHub raw files and Docker Hub, and port `2099` free.
2. Run the one-liner for the user's shell. Use `--yes` or `-Yes` only when the user explicitly asks for non-interactive install.
3. Verify health: `curl -sSf http://localhost:2099/api/v1/health`.
4. Tell the user to open `http://localhost:2099`; the first account created becomes the admin.
5. For local LLM servers, configure provider URLs with `http://host.docker.internal:<port>/v1`.

## Troubleshooting

Use `docker compose ps` and `docker compose logs -f hyper-tern` from the install directory. If auth links are wrong, set `BETTER_AUTH_URL` in `.env`. If the port is busy, edit the `ports` line in `docker-compose.yml` and restart.

For detailed env vars and upgrade notes, read `references/self-hosting.md`.
