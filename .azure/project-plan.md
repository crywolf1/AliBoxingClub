# Project Plan

**Status**: Approved
**Created**: 2026-11-19
**Mode**: AUGMENT

---

## 1. Project Overview

**Goal**: Upgrade the existing Persian and English RING Boxing Club interface into a testable Next.js application with live member profiles, class schedules, bookings, coach operations, and SMS verification backed by MongoDB.

**App Type**: Full-stack SSR

**API Login**: Yes

**Mode**: AUGMENT

**Deployment Plan**: No deployment plan found

---

## 2. Backend - Next.js Route Handlers

| Component | Technology |
|-----------|-----------|
| **Language** | TypeScript |
| **Runtime** | Node |
| **Framework** | Next.js Route Handlers |
| **Package Manager** | npm |
| **Test Runner** | vitest |
| **Mocking Library** | vi.mock |
| **Test Command** | npm test |
| **Orchestration** | docker-compose |

---

## 3. Frontend — Web App

| Component | Technology |
|-----------|-----------|
| **Language** | TypeScript |
| **Framework** | Next.js |
| **Package Manager** | npm |
| **Test Runner** | vitest |
| **Mocking Library** | vi.mock |
| **Test Command** | npm test |

---

## 4. Services Required

| Azure Service | Role in App | Environment Variable | Default Value (Local) | Classification |
|---------------|------------|---------------------|----------------------|----------------|
| MongoDB | Primary store for profiles, classes, bookings, and coach assessments | MONGODB_URI | mongodb://localhost:27017/ring-boxing | Essential |
| SMS provider (provider pending selection) | Deliver time-limited profile verification codes | SMS_PROVIDER; SMS_API_KEY | Provider-specific; no real delivery until configured | Essential |

---

## 5. Prerequisites

### Run

| Tool | Service(s) | Installed | Version |
|------|------------|-----------|---------|
| Node.js | backend, frontend | ✅ | v24.15.0 |
| npm | backend, frontend | ✅ | 11.12.1 |

### Debug

| Tool | Service(s) | Installed | Version |
|------|------------|-----------|---------|
| Docker | MongoDB | ✅ | 24.0.6 |
| Docker Compose | MongoDB | ✅ | 2.24.6 |
| Chrome | frontend | ✅ | Detected |

---

## 6. Design System & UI

**Component Library**: Fluent UI v9
**Style Direction**: Athletic, editorial, and serious; preserve the existing dark charcoal, impact-red, warm off-white, and bold bilingual composition with compact controls and confident spacing.
**Typography**: Segoe UI Variable

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#ef3b24` | Primary booking actions, active navigation, and live availability accents |
| `accent`  | `#d8ff3e` | Training highlights and secondary performance markers |
| `surface` | `#111410` | Dark page and card backgrounds |
| `text`    | `#f5f1e8` | Headings and primary body text |
| `muted`   | `#a8ada5` | Secondary descriptions, schedule metadata, and captions |
| `border`  | `#343932` | Card, input, and divider borders |

### Pages

| Page | Route | Purpose | Layout |
|------|-------|---------|--------|
| Classes | `/classes` | Browse public and VIP schedules and start a booking | header, nav, main, grid, card-list |
| Athlete Profile | `/profile` | Verify a phone, maintain athlete details, and review coach feedback | header, nav, main, split(a\|b), form, action-bar |
| Coach Dashboard | `/coach` | Review athletes and record scores and private feedback | header, nav, sidebar, main, kpi-row, table, modal |

### Sample Content

```
Classes — class:
| Class | Schedule | Time | Capacity | Status |
| Boxing Fundamentals | Sat & Mon | 17:00 | 12; 5 booked | 7 seats |
| Technique & Bag Work | Sun & Tue | 18:30 | 10; 7 booked | 3 seats |
| VIP Coaching | Sat–Wed | 19:00 | 4; 2 booked | 2 seats |
| Fight Conditioning | Thursday | 16:30 | 8; 8 booked | Full |

Athlete Profile — athlete:
Arsh Kazemi · 0912•••1234 · Cardio 82 · Power 76 · Speed 69
Coach message: Focus on returning both hands to guard quickly after each punch.
Medical fields remain private and are only entered when necessary.

Coach Dashboard — athlete:
| Athlete | Cardio | Power | Speed | Feedback |
| Arsh Kazemi | 82 | 76 | 69 | Speed up the defensive hand return |
| Sara Mohammadi | 74 | 81 | 88 | Continue technical footwork drills |
| Reza Taheri | 69 | 71 | 79 | Improve hip rotation in cross combinations |
```

---

## 7. Project Structure

```
project-root/
├── .azure/
│   └── project-plan.md
├── .env.example
├── docker-compose.yml
├── package.json
├── services/
│   ├── ring-web/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── tests/
│   │   └── package.json
│   └── shared/
│       ├── types/
│       └── schemas/
└── next.config.ts
```

---

## 8. Route Definitions

| # | Method | Path | Description | Request Body | Response Body | Status Codes |
|---|--------|------|-------------|-------------|--------------|-------------|
| 1 | GET | `/api/health` | Health check | — | `{ status, services }` | 200, 503 |
| 2 | GET | `/api/classes` | List classes and live capacity | — | `{ data: Class[] }` | 200, 500 |
| 3 | POST | `/api/classes/:id/bookings` | Reserve a class seat | `{ athleteId, date }` | `{ data: Booking }` | 201, 422, 409, 500 |
| 4 | POST | `/api/profile/verification/send` | Send an SMS verification code | `{ phone }` | `{ expiresAt }` | 200, 422, 502 |
| 5 | POST | `/api/profile/verification/confirm` | Confirm a verification code | `{ phone, code }` | `{ data: Athlete }` | 200, 422, 409, 500 |
| 6 | GET | `/api/profile/:id` | Read an athlete profile | — | `{ data: Athlete }` | 200, 404, 500 |
| 7 | PUT | `/api/profile/:id` | Update an athlete profile | `{ firstName, lastName, phone, medicalFields }` | `{ data: Athlete }` | 200, 422, 404, 500 |
| 8 | GET | `/api/coach/athletes` | List athletes and assessments | — | `{ data: Athlete[] }` | 200, 500 |
| 9 | PUT | `/api/coach/athletes/:id/performance` | Save coach scores and private feedback | `{ cardio, power, speed, message }` | `{ data: Assessment }` | 200, 422, 404, 500 |

---

## 9. Next Steps

1. Run **azure-project-scaffold** to execute this plan
2. Run **azure-project-integrate** to wire the frontend to live data, smoke-test the backend, and create the migrations
3. Run **azure-debug-plan** → **azure-debug-generate** for Docker emulators and VS Code debugging
4. Run the **azure-deploy** agent when ready; it uses **azure-app-onboard** for architecture, cost estimation, IaC generation, provisioning, and health verification
