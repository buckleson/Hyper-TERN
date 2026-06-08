# Hyper-Tern

**Stop overpaying for agent LLM calls.**

Hyper-Tern is an open-source model router for AI agents. It gives your agent one OpenAI-compatible endpoint, then decides where each request should go: cloud model, subscription provider, custom API, or local inference server.

- ⚡ **Smart routing**: send simple tasks to cheaper models and save stronger models for harder work.
- 💸 **Cost control**: track every dollar, token, message, provider, and fallback from one dashboard.
- 🧠 **Local inference**: run basic tasks on Ollama, LM Studio, llama.cpp, vLLM, or any OpenAI-compatible local server.
- 🔁 **Automatic fallbacks**: retry failed queries on different models or providers without rewriting your agent.
- 🧩 **OpenRouter + LiteLLM energy**: model access like OpenRouter, gateway control like LiteLLM, packaged as a self-hosted product.
- 🚀 **One-command setup**: install with Docker, then let Hyper-Tern handle routing, observability, limits, and notifications.

## Why Teams Use It

- **Route by task, not guesswork**: Hyper-Tern scores every request and sends simple work to cheap models while preserving stronger models for harder prompts.
- **Run local models for basic tasks**: connect Ollama, LM Studio, llama.cpp, vLLM, or any OpenAI-compatible local server and use local inference for low-risk, low-complexity requests.
- **Context management**: keep agent traffic organized by tenant, agent, message, provider, tier, routing reason, and fallback chain so debugging does not turn into archaeology.
- **Fallback when a model fails**: configure fallback models and providers so failed requests can move to the next route automatically.
- **Track every dollar**: see costs, tokens, messages, providers, agents, and savings across the whole workspace.
- **Notifications and limits**: set token and cost thresholds so runaway usage gets caught early.
- **Works with your agent stack**: OpenClaw, Hermes, OpenAI SDK, Vercel AI SDK, LangChain, cURL, or any agent that speaks OpenAI-compatible HTTP.
- **Self-host first**: Docker ships the frontend, backend, migrations, and PostgreSQL wiring as one local stack.

## One-Line Install

macOS / Linux:

```bash
bash <(curl -sSL https://raw.githubusercontent.com/buckleson/Hyper-TERN/main/docker/install.sh)
```

Windows PowerShell:

```powershell
irm https://raw.githubusercontent.com/buckleson/Hyper-TERN/main/docker/install.ps1 | iex
```

The installer downloads the Docker Compose file, creates a local `.env`, generates `BETTER_AUTH_SECRET`, starts PostgreSQL and Hyper-Tern, then waits for `http://localhost:2099/api/v1/health`.

Prefer to inspect before running:

```bash
curl -sSLO https://raw.githubusercontent.com/buckleson/Hyper-TERN/main/docker/install.sh
bash install.sh --dry-run
bash install.sh
```

## AI-Assisted Install

This repo includes a Codex skill at `.codex/skills/hyper-tern-installer/SKILL.md`. Give that skill to an AI coding agent and ask:

```text
Use the Hyper-Tern installer skill to install Hyper-Tern on this machine.
```

The skill tells the agent how to detect the OS, verify Docker Compose, choose the right one-line installer, run a dry run when appropriate, start the stack, and confirm the health endpoint. It is intentionally small so the AI can figure out the host-specific details without hardcoding one environment.

## Docker

The shipped self-host image is:

```bash
docker pull hypertern/hyper-tern:latest
```

Manual Compose install:

```bash
curl -O https://raw.githubusercontent.com/buckleson/Hyper-TERN/main/docker/docker-compose.yml
curl -O https://raw.githubusercontent.com/buckleson/Hyper-TERN/main/docker/.env.example
cp .env.example .env
openssl rand -hex 32
docker compose up -d
```

Open `http://localhost:2099` and create the first admin account.

The current canonical release package is `packages/hyper-tern`, and the Docker release pipeline tags the image from that package version.

## Local Model Routing

Hyper-Tern can route to local inference for basic tasks:

- **Ollama** at `http://host.docker.internal:11434`
- **LM Studio** at `http://host.docker.internal:1234/v1`
- **llama.cpp** at `http://host.docker.internal:8080/v1`
- **Any OpenAI-compatible server** exposed to the container

In self-hosted Docker mode, private and local HTTP provider URLs are allowed so your gateway can reach host-running models without a cloud proxy.

## Core Workflow

1. Install Hyper-Tern with the one-line command or Docker Compose.
2. Create the first admin account.
3. Add API keys, subscription providers, or local inference providers.
4. Point your agent at Hyper-Tern's OpenAI-compatible endpoint.
5. Configure tiers, fallback models, limits, and notifications.
6. Watch cost, token, and message analytics from the dashboard.

## OpenAI-Compatible Endpoint

Point agents at:

```text
http://localhost:2099/v1
```

Use the API key created for an agent in the dashboard. Hyper-Tern handles scoring, model selection, provider forwarding, logging, fallback routing, and cost attribution.

## More Docs

- Docker guide: `docker/DOCKER_README.md`
- Docker Compose: `docker/docker-compose.yml`
- Installer scripts: `docker/install.sh`, `docker/install.ps1`
- Development guide: `AGENTS.md`

## License

MIT
