# ORBIQ CRM

A portfolio-grade CRM SaaS concept built around **revenue operations, customer journeys and account intelligence**.

> ORBIQ is an interactive product demo rather than a marketing landing page. The experience is designed to feel like one connected operating system for a small B2B revenue team.

## Core product idea

Traditional CRMs often separate pipeline, tasks, customer journeys, activity and analytics into disconnected screens. ORBIQ keeps one selected opportunity in context across the workspace and turns raw CRM data into actionable signals.

The central operating model is:

**stage → evidence → exit gate → handoff**

That model appears across the Command Center, Pipeline Room, Journey Studio, Activity Center, Action Desk, Calendar and Revenue Intelligence.

## Product surfaces

- **Command Center** — stage gates, readiness, blockers, flow health and next-best moves
- **Pipeline Room** — drag-and-drop opportunity management with buying context and revenue risk
- **Journey Studio** — six-stage lifecycle from Discovery through Retention, synced to the selected deal
- **Activity Center** — live customer, pipeline, team and system events
- **Revenue Action Desk** — tasks prioritized by timing, customer impact and linked opportunity context
- **Revenue Calendar** — meetings, actions and expected closes on one timeline
- **Revenue Intelligence** — target coverage, forecast bridge, decision levers and portfolio narrative
- **Contacts** — stakeholder directory, relationship roles and profile context
- **Companies** — account health, ARR, expansion and relationship intelligence
- **Opportunity Focus** — persistent side panel with gate evidence, decision readiness, buying group and quick actions
- **Command Palette** — global navigation and CRM search with `⌘ / Ctrl + K`
- **Quick Create** — deals, contacts and tasks without leaving the current workflow
- **Settings** — workspace preferences and demo reset controls

## Interaction model

The demo is intentionally connected:

- moving a deal creates an activity event;
- completing or reopening a task updates the activity stream;
- Email / Call / Task actions from Opportunity Focus create live CRM activity;
- the selected deal persists across Command Center, Pipeline Room and Journey Studio;
- Calendar close events and Revenue Intelligence decision levers open the linked opportunity;
- demo state is persisted in `localStorage`.

## Design direction

ORBIQ uses a restrained enterprise visual language:

- soft neutral surfaces and selective semantic color;
- larger editorial typography for key operating narratives;
- compact information density where decisions are made;
- subtle depth and motion instead of decorative effects;
- consistent hover, focus and reduced-motion behavior;
- responsive desktop, tablet and mobile layouts.

## Stack

- Next.js 15
- React 19
- TypeScript
- Custom responsive CSS design system
- GitHub Actions CI
- Vercel deployment

## Demo scope

This repository is a front-end product prototype with realistic seeded data. It does not include production authentication or a persistent backend. CRM changes are saved locally in the browser for the demo experience.

## Development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

Every push to `main` is validated by GitHub Actions and automatically deployed through the connected Vercel project.
