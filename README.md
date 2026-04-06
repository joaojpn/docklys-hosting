<div align="center">
  <img src="docs/assets/logo.png" alt="Docklys" width="260" />
  <p><strong>Deploy Discord, Telegram, and WhatsApp bots in seconds.<br/>No infrastructure knowledge required.</strong></p>

  <p>
    <a href="https://github.com/joaojpn/docklys-hosting/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-red.svg" alt="License MIT" /></a>
    <a href="https://github.com/joaojpn/docklys-hosting/actions/workflows/ci.yml"></a>
    <img src="https://img.shields.io/badge/version-0.3.0-blue" alt="Version" />
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome" />
  </p>

  <p>
    <a href="https://docklys.io">Website</a> ·
    <a href="https://discord.gg/ke5V4NeQ49">Discord</a> ·
    <a href="#-getting-started">Getting Started</a> ·
    <a href="CONTRIBUTING.md">Contributing</a>
  </p>
</div>

---

## What is Docklys?

Docklys is an open-source, self-hosted platform for deploying bots. Zip your project, upload it, and Docklys handles everything else — installing dependencies, isolating your application in a Docker container, and keeping it running.

Think of it as your personal Vercel, built specifically for bots.
```
your-bot/
├── main.py           # your code
└── requirements.txt  # your dependencies
```

Zip it. Upload it. Done.

## Features

- **Zero-config deploys** — zip your project and upload, no configuration files required
- **Full isolation** — every application runs in its own Docker container
- **Multi-platform** — supports Discord, Telegram, WhatsApp, and any long-running process
- **Multi-language** — Python and Node.js detected automatically
- **Real-time monitoring** — CPU, RAM, uptime, and logs streamed live
- **One-click actions** — start, stop, restart, and delete with a single click
- **GitHub login** — sign in with your GitHub account or register with email
- **Self-hosted** — run on your own machine or server, you own your data
- **Open source** — MIT licensed, forever free

## Getting Started

> **Prerequisites:** Docker, Node.js 20+, pnpm
```bash
# 1. Clone the repository
git clone https://github.com/joaojpn/docklys-hosting.git
cd docklys-hosting

# 2. Install dependencies
pnpm install

# 3. Start the database and storage
docker compose up -d

# 4. Set up environment variables
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
# Edit both .env files with your settings

# 5. Run database migrations
cd apps/api && pnpx prisma migrate dev

# 6. Start the development environment
cd ../.. && pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) to access the dashboard.

## Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Fastify, Node.js, TypeScript |
| Database | PostgreSQL, Prisma |
| Storage | MinIO |
| Containers | Docker, Dockerode |
| Auth | JWT, GitHub OAuth |

## Monorepo Structure
```
docklys-hosting/
├── apps/
│   ├── web/          # React frontend (Vite + TypeScript)
│   └── api/          # Fastify backend (Node.js + TypeScript)
├── docs/             # Documentation and assets
└── .github/          # CI/CD, issue templates, PR template
```

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

Found a bug? [Open an issue](https://github.com/joaojpn/docklys-hosting/issues/new?template=bug_report.yml).
Have an idea? [Request a feature](https://github.com/joaojpn/docklys-hosting/issues/new?template=feature_request.yml).
Want to chat? [Join our Discord](https://discord.gg/ke5V4NeQ49).

## 🔒 Security

If you discover a security vulnerability, please read [SECURITY.md](SECURITY.md) before opening a public issue.

## 📄 License

Docklys is open-source software licensed under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/joaojpn">joaojpn</a> and contributors.</sub>
</div>
