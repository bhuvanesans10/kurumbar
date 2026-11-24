# Kurumbar AI Agents Routing Guide

This document routes development tasks across the Kurumbar monorepo so every service and frontend strictly adheres to the Genie-derived architectural standards and the Kurumbar design system.

## Execution Routing Rules

### 1. `kurumbar-api` (Backend NestJS + Fastify + Prisma)
- **Primary Rule**: Use strict NestJS DI. Controllers handle routing, DTO validation, and response shaping only; all business logic belongs in services (`*.service.ts` / `core/*.ts`).
- **Required Reading**:
  - `.ai-skills/backend-standards.md`
  - `.ai-skills/backend/database-schema.md`
  - `.ai-skills/backend/external-integrations.md`
- **Guards & Types**: Always use `FastifyRequest` / `FastifyReply` from `fastify`, validate environment variables eagerly in constructors (`InternalServerErrorException`), and enforce `GlobalAuthGuard` with `@Public()` on intentionally public endpoints.
- **Prisma Schema Rule**: Keep all `model` declarations in the upper section of `prisma/schema.prisma` and all `enum` declarations in the lower section. Never interleave them. Wrap verified migration files in `BEGIN; ... COMMIT;`.

### 2. `kurumbar-app` (Mobile App — Flutter)
- **Primary Rule**: Strict separation between UI (`lib/pages/`, `lib/components/`) and state/API layers (`lib/backend/providers/`, `lib/backend/api/`). UI files must NEVER issue direct HTTP calls.
- **Required Reading**:
  - `.ai-skills/flutter-state-and-di.md`
  - `.ai-skills/flutter-api-layer.md`
  - `.ai-skills/frontend/state-network-ui.md`
  - `design-system/MASTER.md` (plus applicable `design-system/pages/*.md`)
- **Theming & i18n**: All colors, typography, radii, shadows, and spacers must reference `KurumbarDesignSystem` (`lib/utils/design_system.dart`). All user-visible strings must support both English (`en`) and Tamil (`ta`) via `l10n`.

### 3. `kurumbar-admin` (Admin Dashboard) & `kurumbar-web` (Public Website)
- **Primary Rule**: Follow `design-system/MASTER.md` and page-specific overrides in `design-system/pages/` as the single source of truth for colors, typography, spacing, WCAG 4.5:1 contrast, and responsive breakpoints (`375px`, `768px`, `1024px`, `1440px`).
- **Required Reading**:
  - `design-system/MASTER.md`
  - `.claude/skills/ui-ux-pro-max/SKILL.md`
- **Bilingual & Accessibility**: Support Tamil (`ta`) and English (`en`), maintain 44px+ touch targets, label every form input, and avoid emoji icons (use SVG icons only).
