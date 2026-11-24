# Kurumbar Platform — Architectural & Product Decisions

Recorded prior to Phase 0 implementation. Items marked `ASSUMPTION, UNVERIFIED` require final stakeholder sign-off before Phase 1 backend implementation begins.

| # | Decision | Status | Details |
|---|---|---|---|
| 1 | **Reuse Genie Architecture & Core Code** | Confirmed | Follow `fleet-gateway` (NestJS/Fastify/Prisma), `the-genie-customer-app` (Flutter/Provider/GoRouter), and `command-center-react-app` (React/Redux Toolkit/Tailwind) patterns and reuse core infrastructure modules. |
| 2 | **Separate from `kumba-gounder-matrimony`** | Confirmed | Independent client repository and domain; do not couple or modify `kumba-gounder-matrimony`. |
| 3 | **Two Genders Only** | Confirmed | Member ID generation uses two gender codes only: `M` (Male) and `W` (Female), matching `TN01M0000001` / `TN01W0000001`. |
| 4 | **Bilingual Tamil + English** | Confirmed | Both Tamil (`ta`) and English (`en`) supported across mobile app, public website, and news posts. |
| 5 | **Android + iOS Dual Launch** | Confirmed | Flutter mobile app targets both Android and iOS at launch. |
| 6 | **Hosting & External Accounts** | Confirmed | Infrastructure, MSG91/DLT, Firebase, Apple/Google Store, and domain accounts will be provisioned under owner/client accounts; keep all configuration strictly environment-driven. |
| 7 | **Matrimony Profile Browsing Visibility** | `ASSUMPTION, UNVERIFIED` | Verified matrimony members can browse all other verified matrimony profiles within the app with phone numbers hidden (contact routed via Kurumbar team). Needs explicit confirmation of user's "once for all" response. |
| 8 | **Single Unified OTP Login** | Confirmed | Users authenticate once via mobile OTP into a unified `User` session rather than repeating OTP verification separately for Registration, Matrimony, Sales, and Jobs. |
| 9 | **Member Registration Prerequisite** | Confirmed | Users must complete Member Registration (`MemberProfile` + Member ID) before accessing Matrimony, Sales, or Job Portal creation/browsing features. |
| 10 | **In-App Digital ID Card Only** | Confirmed | ID card (Front + Back with QR code) is rendered for in-app viewing/saving only; physical CR80 print bleed/sizing is not required. |
| 11 | **Member ID Sequence Scope** | `ASSUMPTION, UNVERIFIED` | 7-digit sequence counter increments per `(districtCode, genderCode)` pair (e.g., `TN01M0000001`, `TN02M0000001`) based on spec format examples; confirm whether statewide sequence is preferred instead, and confirm official district numeric codes (`01`, `02`, ...). |
