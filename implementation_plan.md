# Gravity-Lens Dashboard — Implementation Plan

## Overview

Build a **production-grade, premium dashboard** for Gravity-Lens in the `d:\PROJECT\Main-deshboard-Gravity-Lens\nebula-lens` folder.
This is a **UI-only build** with static/mock data. Once complete, it will be safely imported into the main `d:\PROJECT\Gravity-Lens` project.

---

## Layout Architecture — Dual Collapsible Panel System

```
┌──────────────────────────────────────────────────────────────────┐
│  Top Header Bar (Logo + Breadcrumb + User + Theme Toggle)        │
├───────────────────┬──────────────────────┬───────────────────────┤
│                   │                      │                       │
│  LEFT PANEL       │   CENTER / MAIN      │   RIGHT PANEL         │
│  (Collapsible)    │   CONTENT AREA       │   (Collapsible)       │
│                   │                      │                       │
│  • Nav Links      │   Canvas / Overview  │   Service List        │
│  • Quick Stats    │   Logs / Timeline    │   (clickable items)   │
│  • AWS Connect    │   Alerts / Cost      │   Service Details     │
│  • Settings       │   Settings           │   on click            │
│                   │                      │                       │
│  [← collapse]     │                      │   [collapse →]        │
└───────────────────┴──────────────────────┴───────────────────────┘
```

### Panel Behavior
- **Left Panel** — Navigation sidebar. Collapsible to icon-only mode (like VS Code)
- **Right Panel** — Service list. Collapsible to hide completely (max canvas space)
- **Center** — Main content. Changes based on left nav selection
- **Resize handles** between panels (drag to adjust width)

---

## Tech Stack

| Layer | Choice |
|---|---|
| **Framework** | Next.js (App Router) — same as nebula-lens |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Canvas** | React Flow + ELK (from nebula-lens) |
| **Animations** | Framer Motion |
| **State** | Zustand |
| **Charts** | Recharts + [bklit.com](https://bklit.com) component library |
| **Icons** | Lucide React |
| **Dates** | date-fns |
| **Font** | Geist (Vercel's font — ultra clean) |

---

## Color System — Deep Space + Multi-Color Aurora

```css
/* Backgrounds */
--bg-base:        #030308   /* deepest black */
--bg-surface:     #0A0A0F   /* matches main site */
--bg-card:        #0E0E16   /* card background */
--bg-card-hover:  #13131F   /* card on hover */
--bg-panel:       #0C0C14   /* panel background */
--border:         rgba(255,255,255,0.06)
--border-active:  rgba(99,102,241,0.3)

/* Aurora Accent Palette */
--indigo:   #6366F1   /* primary */
--purple:   #A855F7   /* secondary */
--pink:     #EC4899   /* accent */
--teal:     #14B8A6   /* success / health */
--cyan:     #06B6D4   /* info */
--amber:    #F59E0B   /* warning */
--red:      #EF4444   /* error / alert */

/* Text */
--text-primary:   #FFFFFF
--text-secondary: rgba(255,255,255,0.6)
--text-muted:     rgba(255,255,255,0.3)
```

**Light Mode** — Soft white backgrounds with the same accent palette, subtle shadows.

---

## Dashboard Sections (7 Total)

### 1. 🏠 Overview (Home)
The landing page of the dashboard when user first enters.

**Cards Row:**
- Total Services (count badge)
- Monthly Cost Estimate ($ with trend arrow)
- Active Alerts / Issues (count with severity)
- Health Score (% with colored ring)
- Last Scan Timestamp (relative time "2 mins ago")
- Recent Changes Count (last 24h)
- Resources by Region (mini world map or region list)

**Below Cards:**
- Mini architecture canvas preview (read-only, click to go to Canvas)
- Recent Activity Feed (last 5 events)
- Quick action buttons (Scan Now, View Logs, Compare Versions)

---

### 2. 🗺️ Canvas (Infrastructure Map)
Full React Flow canvas — the core feature, imported/improved from nebula-lens.

**Features:**
- Full-screen canvas with TopNav embedded
- Left toolbar: Lens switcher (Structural / Blast Radius / Cost)
- Right: Metrics sidebar (node details on click)
- Undo / Redo with keyboard shortcuts
- MiniMap (bottom right)
- Animated edges with particle flow
- Node types: VPC, Subnet, EC2, Lambda, RDS, S3, SQS, API Gateway

---

### 3. 📋 Live Logs
Terminal-style log viewer.

**UI:**
- Dark terminal panel with monospace font (green/white text on near-black)
- **Top bar**: Service filter dropdown + Severity filter (ALL / ERROR / WARN / INFO) + Search input + Auto-scroll toggle + Download button
- **Log lines**: `[HH:MM:SS]  [SERVICE]  [SEVERITY]  message`
- Color-coded badges: 🔴 ERROR · 🟡 WARN · 🟢 INFO · 🔵 DEBUG
- Simulated auto-streaming (new lines appear every 2s with mock data)

---

### 4. ⏳ Timeline (Version History)
Infrastructure change replay with scrubber.

**UI:**
- **Scrubber bar** at the bottom — drag to travel through time
- **Version cards** above: each snapshot shows date, change count, who triggered it
- **Diff badges** on canvas nodes: 🟢 Added · 🔴 Removed · 🟡 Modified
- **Play button** to auto-animate between versions
- **Snapshot sidebar**: list of all saved versions with filters (date range)

---

### 5. 🚨 Alerts
Security and compliance alerts panel.

**UI:**
- Alert cards with severity (Critical / High / Medium / Low)
- Each alert: icon + title + affected resource + timestamp + "Resolve" button
- Filter bar: by severity, by service, by status (open/resolved)
- Alert trend chart (Recharts bar chart — alerts per day last 7 days)

---

### 6. 💰 Cost Analysis
Cloud spend visibility.

**UI:**
- Total monthly spend (big number, trend %)
- **Line chart** (Recharts): Daily cost over 30 days with baseline zone
- **Donut chart**: Cost breakdown by service (EC2, RDS, Lambda, S3, etc.)
- **Cost table**: Service | Region | Usage | Cost | vs Last Month
- Budget threshold indicator

---

### 7. ⚙️ Settings
User and account configuration.

**UI:**
- AWS Connection settings (mock form: Access Key, Secret, Region)
- Scan Schedule settings (manual / every 6h / every 24h)
- Notification preferences
- Theme toggle (Dark / Light)
- Danger zone (Disconnect AWS)

---

## Right Panel — Service List

When the right panel is open:
- **Search bar** to filter services
- **Service cards** (compact list):
  - Service icon + name + type (EC2 / Lambda / RDS / S3)
  - Status dot (green/red/yellow)
  - Region badge
- **Click a service** → expands a detail drawer/sheet showing:
  - Service metadata (ID, ARN, region, created date)
  - Health metrics (mini sparkline chart)
  - Recent logs for that service
  - Related services / connections

---

## Left Panel — Navigation

```
  ● GravityLens          [< collapse]
  ─────────────────────
  🏠  Overview
  🗺️  Canvas
  📋  Live Logs
  ⏳  Timeline
  🚨  Alerts             ← badge with count
  💰  Cost Analysis
  ─────────────────────
  ⚙️  Settings
  ─────────────────────
  [Connect AWS] button
  ─────────────────────
  User Avatar + Name
```

When collapsed → shows only icons (VS Code style).

---

## Animation & Micro-interaction Plan

| Element | Animation |
|---|---|
| Panel collapse/expand | Framer Motion spring slide |
| Page/section transition | Fade + slide up (0.2s) |
| Card hover | Scale 1.01 + border glow pulse |
| Alert badge | Ping pulse animation |
| Log lines appearing | Slide in from bottom |
| Scrubber drag | Spring physics on canvas nodes |
| Service click in right panel | Sheet slides in from right |
| Health score ring | SVG stroke-dashoffset animated on mount |
| Cost chart | Recharts animated draw-in |
| Canvas node hover | Glow ring expand |

---

## File/Folder Structure

```
nebula-lens/src/
├── app/
│   ├── dashboard/
│   │   ├── layout.tsx          ← Dashboard shell (header + panels)
│   │   ├── page.tsx            ← Overview page
│   │   ├── canvas/page.tsx     ← Infrastructure canvas
│   │   ├── logs/page.tsx       ← Live logs terminal
│   │   ├── timeline/page.tsx   ← Timeline scrubber
│   │   ├── alerts/page.tsx     ← Alerts panel
│   │   ├── cost/page.tsx       ← Cost analysis
│   │   └── settings/page.tsx   ← Settings
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── DashboardShell.tsx  ← 3-panel layout wrapper
│   │   ├── LeftSidebar.tsx     ← Collapsible nav
│   │   ├── RightPanel.tsx      ← Collapsible service list
│   │   └── TopHeader.tsx       ← Logo + breadcrumb + theme
│   ├── overview/
│   │   ├── StatCard.tsx
│   │   ├── RegionMap.tsx
│   │   └── ActivityFeed.tsx
│   ├── logs/
│   │   └── LogTerminal.tsx
│   ├── timeline/
│   │   └── TimelineScrubber.tsx
│   ├── alerts/
│   │   └── AlertCard.tsx
│   ├── cost/
│   │   ├── CostChart.tsx
│   │   └── ServiceBreakdown.tsx
│   ├── canvas/                 ← (existing nebula-lens components)
│   └── ui/                     ← shadcn/ui + custom primitives
├── data/
│   └── mock/
│       ├── services.ts         ← Mock AWS services
│       ├── logs.ts             ← Mock log entries
│       ├── snapshots.ts        ← Mock version snapshots
│       └── alerts.ts           ← Mock alert data
└── store/
    ├── useCanvasStore.ts       ← (existing)
    ├── useDashboardStore.ts    ← New: panel state, active section
    └── useServiceStore.ts      ← New: selected service, filters
```

---

## Build Phases

| Phase | What we build | Priority |
|---|---|---|
| **Phase 1** | Dashboard shell: Header + Left sidebar + Right panel (collapsible) + routing | 🔴 First |
| **Phase 2** | Overview page: stat cards + activity feed + region display | 🔴 First |
| **Phase 3** | Canvas page: port nebula-lens canvas into dashboard | 🟡 Second |
| **Phase 4** | Live Logs terminal | 🟡 Second |
| **Phase 5** | Timeline scrubber | 🟠 Third |
| **Phase 6** | Alerts + Cost Analysis pages | 🟠 Third |
| **Phase 7** | Settings + Light/Dark mode polish | 🟢 Final |

---

## Open Questions

> [!IMPORTANT]
> **Before we start Phase 1**, please confirm:
> 1. Should the dashboard live at `/dashboard` route inside the `nebula-lens` Next.js app? Or should we create a brand new Next.js project in `Main-deshboard-Gravity-Lens/`?
> 2. For the **bklit.com** component library — do you have specific components in mind from their library you want to use (e.g. charts, cards)?
> 3. Should the **right panel service list** show a hardcoded list of services (EC2, Lambda, RDS, S3, SQS, API Gateway, VPC) matching the canvas nodes?

---

## Verification Plan

### Manual Verification
- All 7 routes are accessible and render correctly
- Left sidebar collapses to icon-only and re-expands smoothly
- Right panel collapses and re-expands smoothly
- Clicking a service in the right panel opens the detail sheet
- Log terminal auto-streams mock data
- Timeline scrubber drags smoothly and canvas updates
- Light/Dark mode toggle works across all pages
- Dashboard matches Gravity-Lens brand (aurora colors, deep black)


Phase 1 and Phase 2 complete 
