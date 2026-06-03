# AI-Based Modular Interior Design & Visualization Platform (SaaS)

This repository contains the complete structural monolith implementation for a premium SaaS application designed for interior designers, clients, and vendor partners.

---

## 🛠️ Technology Stack
- **Frontend Framework**: Next.js 14 (App Router), React, TypeScript
- **Styling**: TailwindCSS & Custom Modern CSS Elements (glassmorphic nav bars, harmonised dynamic animations)
- **State Management**: Zustand (persisted stores for workspaces, notifications, and AI histories)
- **Database Engine**: Prisma ORM with PostgreSQL dialect configuration
- **Background Actions**: BullMQ queue runner integration
- **Third-Party Integrations**: Stripe Billing API, OpenAI Node client, Redis Cache

---

## 📂 Project Architecture

```text
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma                  # Prisma ORM Database Models (User, Workspace, Project, Team, etc.)
│   │   ├── seed.ts                        # Seed script for initial workspaces and mock tasks
│   │   └── migrations/
│   │       ├── 20240521000000_vendor_module/ # Custom SQL for vendor schema additions
│   │       └── 20240515_project_team_module/  # Database migration for Project Team Module [NEW]
│   ├── src/
│   │   ├── app/
│   │   │   └── api/
│   │   │       ├── ai/chat/route.ts       # AI assistant conversation endpoint
│   │   │       └── notifications/route.ts  # Notifications GET/PATCH endpoint
│   │   ├── lib/
│   │   │   ├── aiProvider.ts              # OpenAI SDK Client Configuration
│   │   │   ├── audit.ts                   # Immutable Activity Logger
│   │   │   ├── prisma.ts                  # Shared Prisma client wrapper
│   │   │   ├── redis.ts                   # Cache connector
│   │   │   ├── storage.ts                 # Mock S3 file uploader
│   │   │   └── stripe.ts                  # Stripe payment and portal generator
│   │   ├── middleware/
│   │   │   └── authMiddleware.ts          # JWT verifier & workspace header scope guard
│   │   ├── services/
│   │   │   ├── auth/                      # Register, Login, Token rotation services
│   │   │   ├── ai/                        # OpenAI GPT-4 text generator
│   │   │   ├── automation/                # Condition evaluation trigger engine
│   │   │   ├── notification/              # Real-time WebSocket/Email dispatches
│   │   │   └── workspace/                 # Workspace creations & invitations
│   │   ├── repositories/
│   │   │   └── workspaceRepository.ts     # Workspace DB access wrapper
│   │   └── types/
│   │       └── auth.ts                    # Token payloads and interfaces
│   └── app/                               # VENDOR & TEAM EXTENSION MODULES
│       ├── api/
│       │   ├── vendor/                    # Vendor Module Route Handlers
│       │   │   ├── onboarding/route.ts    # Vendor registration & files uploader
│       │   │   ├── dashboard/route.ts     # KPI metrics API
│       │   │   ├── products/route.ts      # Catalog products addition
│       │   │   └── assignments/[id]/route.ts # Task status update handler
│       │   ├── projects/[id]/             # Project Team Module API routes [NEW]
│       │   │   ├── team/route.ts          # GET team members lists
│       │   │   ├── assign/route.ts        # POST team assignment (Manager only)
│       │   │   ├── progress/route.ts      # GET/POST completion percentages
│       │   │   ├── issues/route.ts        # GET/POST logged execution issues
│       │   │   └── photos/route.ts        # GET/POST proof of installation photos
│       │   └── webhooks/stripe.ts         # Stripe payment success log webhook
│       ├── middleware/
│       │   └── vendorGuard.ts             # REST guard for APPROVED vendors
│       ├── models/
│       │   └── projectTeamModel.ts        # Repository query layer for project teams [NEW]
│       ├── routers/
│       │   └── projectTeamRouter.ts       # Express router fallback wrapper [NEW]
│       ├── schemas/vendor/
│       │   └── onboarding.ts              # Zod validation models
│       ├── services/
│       │   ├── vendor/
│       │   │   └── vendorService.ts       # Core vendor logic & KPIs aggregator
│       │   └── assignmentService.ts       # Team assignment guards & progress calculator [NEW]
│       └── utils/
│           └── authMiddleware.ts          # Role permission mapping guards [NEW]
│
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── vendor/                    # VENDOR FRONTEND PAGES
│       │   │   ├── layout.tsx             # Sidebar layout
│       │   │   ├── dashboard/page.tsx     # KPI metrics charts page
│       │   │   ├── onboarding/page.tsx    # Document stepper page
│       │   │   └── assignments/page.tsx   # Assigned items list page
│       │   └── projects/[id]/             # PROJECT TEAM FRONTEND PAGES [NEW]
│       │       ├── team/page.tsx          # Team members directory & assignments builder
│       │       └── execution/page.tsx     # Construction milestone boards, photos, and Gantt charts
│       ├── components/
│       │   ├── AI/                        # AIAssistant.tsx, AIChat.tsx panel bubble layouts
│       │   ├── Automation/                # AutomationBuilder.tsx, RuleList.tsx wizards
│       │   ├── Notifications/             # NotificationCenter.tsx drawer
│       │   ├── Workspace/                 # WorkspaceSwitcher.tsx switcher
│       │   ├── Views/                     # ListView, BoardView, CalendarView, TimelineView, ChartView
│       │   └── vendor/                    # Reusable elements (KpiCard, ProjectChart, VendorAssignmentTable, etc.)
│       │       ├── ExecutionProgressBar.tsx # Styled milestones completion component [NEW]
│       │       └── IssueTracker.tsx       # Collapsible issues submit form & feed component [NEW]
│       ├── hooks/
│       │   └── vendor/
│       │       └── useVendorAssignments.ts# Assignment synchronizer hook
│       ├── utils/
│       │   ├── api/
│       │   │   └── client.ts              # Global apiClient helper for GET/POST [NEW]
│       │   └── authMiddleware.ts          # UI page permissions scope checker [NEW]
│       └── stores/
│           ├── aiStore.ts                 # Chat queue states
│           ├── notificationStore.ts       # Client alerts array state
│           ├── workspaceStore.ts          # Active workspace toggler
├── package.json                           # Workspace dependency list
├── tailwind.config.js                     # Extended colors for AI/Automation dashboards
└── next.config.js                         # Next.js configurations
```

---

## ⚡ Setup & Execution

1. **Install Dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Generate Database Client**:
   ```bash
   npx prisma generate --schema=./backend/prisma/schema.prisma
   ```

3. **Development Server**:
   ```bash
   npm run dev
   ```

---

For compliance audit checksheets, refer to [CHECKLIST.md](file:///c:/Users/VEDANT%20RAJU%20BORKAR/OneDrive/Desktop/mytest/ID%20prompt%20by%20Swayam/CHECKLIST.md).
