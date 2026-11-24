# Kurumbar Community Platform

Centralized digital platform for the Kurumbar community (`www.kurumbar.org`), providing member registration with digital ID cards, community news, matrimony, local sales listings, and a job portal in Tamil and English.

## Repository Structure

```text
kurumbar/
├── .ai-skills/               # Engineering architecture standards (NestJS, Flutter, Frontend)
├── .claude/skills/           # UI/UX Pro Max design skill
├── agents.md                 # AI agent routing guide across services and frontends
├── brand/                    # Brand logo concepts and color specifications
├── design-system/            # UI/UX Pro Max MASTER design tokens & page overrides
├── docs/
│   ├── PLAN.md               # Architecture, data model, flows, API surface, phases, risks
│   └── DECISIONS.md          # Confirmed product & technical decisions
├── kurumbar-api/             # NestJS 11 + Fastify + Prisma 7 backend API
├── kurumbar-app/             # Flutter mobile app (Android + iOS)
├── kurumbar-admin/           # Admin dashboard (React 19 + Vite + TypeScript + Tailwind 4)
└── kurumbar-web/             # Public website (Next.js App Router + TypeScript + Tailwind)
```

## Quick Start

### 1. Backend API (`kurumbar-api`)
```bash
cd kurumbar-api
cp .env.template .env
pnpm install
pnpm exec prisma generate
pnpm run build
pnpm run start:watch
```

### 2. Mobile App (`kurumbar-app`)
```bash
cd kurumbar-app
flutter pub get
flutter run
```

### 3. Admin Dashboard (`kurumbar-admin`)
```bash
cd kurumbar-admin
pnpm install
pnpm run dev
```

### 4. Public Website (`kurumbar-web`)
```bash
cd kurumbar-web
pnpm install
pnpm run dev
```
