---
name: hyper-tern-installer
description: Install, verify, or troubleshoot Hyper-Tern self-hosted Docker installs. Use when a user asks an AI agent to install Hyper-Tern, run the one-line installer, set up Docker Compose, verify the local app, connect local inference providers, or fix first-run install issues.
---

# Hyper-Tern Installer

Use this skill to install Hyper-Tern on a user's machine through the official Docker installer or to help them recover a failed install.

## Install Flow

1. Detect the host OS and shell.
2. Confirm Docker and Docker Compose v2 are installed:
   - `docker --version`
   - `docker compose version`
3. Prefer a dry run before making changes when the user is cautious:
   - macOS/Linux: `bash install.sh --dry-run`
   - Windows: run `install.ps1 -DryRun`
4. Run the official one-line installer for the detected shell.
5. Verify health:
   - `http://localhost:2099/api/v1/health`
6. Tell the user to open `http://localhost:2099` and create the first admin account.

## One-Line Commands

macOS / Linux:

```bash
bash <(curl -sSL https://raw.githubusercontent.com/buckleson/Hyper-TERN/main/docker/install.sh)
```

Windows PowerShell:

```powershell
irm https://raw.githubusercontent.com/buckleson/Hyper-TERN/main/docker/install.ps1 | iex
```

## Review-First Commands

macOS / Linux:

```bash
curl -sSLO https://raw.githubusercontent.com/buckleson/Hyper-TERN/main/docker/install.sh
bash install.sh --dry-run
bash install.sh
```

Windows PowerShell:

```powershell
irm https://raw.githubusercontent.com/buckleson/Hyper-TERN/main/docker/install.ps1 -OutFile install.ps1
.\install.ps1 -DryRun
.\install.ps1
```

## What The Installer Does

- Creates a local install directory, defaulting to `~/Hyper-Tern`.
- Downloads `docker-compose.yml` and `.env.example`.
- Generates `BETTER_AUTH_SECRET`.
- Starts Hyper-Tern and PostgreSQL with Docker Compose.
- Waits for the health endpoint.

## Local Inference Setup

After install, help the user connect local providers for basic tasks:

- Ollama: `http://host.docker.internal:11434`
- LM Studio: `http://host.docker.internal:1234/v1`
- llama.cpp: `http://host.docker.internal:8080/v1`
- Any OpenAI-compatible local server reachable from Docker

If a local provider cannot connect, check whether the local server is bound to `0.0.0.0` and whether Docker supports `host.docker.internal`.

## Troubleshooting

- `Invalid origin`: set `BETTER_AUTH_URL` in `.env` to the exact URL used in the browser, then restart with `docker compose up -d`.
- Port conflict: edit `PORT` and `BETTER_AUTH_URL` in `.env`.
- App not healthy: run `docker compose logs -f hyper-tern`.
- Need a clean reinstall: run `docker compose down -v` inside the install directory, then reinstall.
- Need to update: run `docker compose pull && docker compose up -d`.

## Success Criteria

The install is complete only when:

- Docker Compose reports the Hyper-Tern container as running or healthy.
- `GET /api/v1/health` returns healthy.
- The dashboard loads at `http://localhost:2099`.
- The user knows where `.env` lives for future configuration.
