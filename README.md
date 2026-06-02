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
│   │   ├── schema.prisma                  # Prisma ORM Database Models
│   │   ├── seed.ts                        # Seed script for initial workspaces and mock tasks
│   │   └── migrations/
│   │       └── 20240521000000_vendor_module/ # Custom SQL for vendor schema additions
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
│   └── app/                               # VENDOR EXTENSION MODULE (App Router backend folder)
│       ├── api/vendor/
│       │   ├── onboarding/route.ts        # Vendor registration & files uploader
│       │   ├── dashboard/route.ts         # KPI metrics API
│       │   ├── products/route.ts          # Catalog products addition
│       │   ├── assignments/[id]/route.ts  # Task status update handler
│       │   └── webhooks/stripe.ts         # Stripe payment success log webhook
│       ├── middleware/
│       │   └── vendorGuard.ts             # REST guard for APPROVED vendors
│       ├── schemas/vendor/
│       │   └── onboarding.ts              # Zod validation models
│       └── services/vendor/
│           └── vendorService.ts           # Core vendor logic & KPIs aggregator
│
├── frontend/
│   └── src/
│       ├── app/
│       │   └── vendor/                    # VENDOR FRONTEND PAGES
│       │       ├── layout.tsx             # Sidebar layout
│       │       ├── dashboard/page.tsx     # KPI metrics charts page
│       │       ├── onboarding/page.tsx    # Document stepper page
│       │       └── assignments/page.tsx   # Assigned items list page
│       ├── components/
│       │   ├── AI/                        # AIAssistant.tsx, AIChat.tsx panel bubble layouts
│       │   ├── Automation/                # AutomationBuilder.tsx, RuleList.tsx wizards
│       │   ├── Notifications/             # NotificationCenter.tsx drawer
│       │   ├── Workspace/                 # WorkspaceSwitcher.tsx switcher
│       │   ├── Views/                     # ListView, BoardView, CalendarView, TimelineView, ChartView
│       │   └── vendor/                    # KpiCard, ProjectChart, OnboardingWizard, VendorAssignmentTable
│       ├── hooks/
│       │   └── vendor/
│       │       └── useVendorAssignments.ts# Assignment synchronizer hook
│       └── stores/
│           ├── aiStore.ts                 # Chat queue states
│           ├── notificationStore.ts       # Client alerts array state
│           ├── workspaceStore.ts          # Active workspace toggler
│           └── vendorStore.ts             # Onboarding & product states
│
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
