# EthicsGate Architecture

## Overview
EthicsGate is a B2B SaaS IRB (Institutional Review Board) ethics review platform.
Multi-tenant architecture where each institution is an isolated organization.

## Tech Decisions

### Why Next.js 14 App Router
- Server components reduce client bundle size
- Server Actions for form mutations
- Built-in API routes
- Middleware for auth + org routing
- Vercel deployment is zero-config

### Why Tiptap (Open Source Only)
- We use the open-source Tiptap editor core (MIT license)
- We DO NOT use Tiptap Cloud, Tiptap Collaboration, or any paid Tiptap features
- Inline annotations are built as CUSTOM Tiptap extensions using the Mark API
- Annotation data is stored in our own Supabase PostgreSQL database
- This avoids Tiptap's per-document pricing ($49-999/mo) and gives us full control
- The Tiptap editor stores proposal content as JSON (ProseMirror document format)

### Why Supabase
- PostgreSQL with Row Level Security for multi-tenancy
- Built-in auth (magic link + password)
- Realtime subscriptions for live annotation updates
- Storage for file uploads
- Generous free tier for prototype, predictable scaling

### Why Not Existing IRB Software
- Existing solutions (IRBNet, OneAegis/IRBManager, Cayuse, InfoEd, Sitero Mentor) are:
  - Legacy enterprise software with dated UIs
  - Expensive ($10K-100K+ annual contracts)
  - No inline annotation on proposals
  - No AI-assisted review capabilities
  - Poor researcher experience
- Our differentiator: Modern UX with Google Docs-style inline commenting ON the proposal text + future AI review assistance

## Project Structure
```
ethicsgate/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Auth pages (login, signup)
│   │   ├── (dashboard)/        # Authenticated app pages
│   │   │   ├── dashboard/
│   │   │   ├── proposals/
│   │   │   │   ├── new/
│   │   │   │   └── [id]/
│   │   │   │       └── review/
│   │   │   ├── admin/
│   │   │   └── profile/
│   │   ├── api/                # API routes
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── editor/             # Tiptap editor + extensions
│   │   │   ├── ProposalEditor.tsx
│   │   │   ├── ReviewEditor.tsx
│   │   │   ├── AnnotationMark.ts      # Custom Tiptap mark extension
│   │   │   ├── AnnotationToolbar.tsx   # Floating toolbar on text select
│   │   │   └── AnnotationSidebar.tsx   # Right sidebar with annotation threads
│   │   ├── proposals/
│   │   ├── review/
│   │   └── layout/
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts       # Browser client
│   │   │   ├── server.ts       # Server client
│   │   │   ├── admin.ts        # Service role client
│   │   │   └── middleware.ts   # Auth middleware
│   │   ├── validators/         # Zod schemas
│   │   ├── hooks/              # Custom React hooks
│   │   └── utils/
│   └── types/                  # TypeScript types
├── supabase/
│   ├── migrations/             # SQL migration files
│   └── seed.sql                # Test data
├── public/
├── architecture.md             # THIS FILE
├── agents.md                   # Agent behavior rules
└── package.json
```

## Key Data Flows

### Proposal Submission
Researcher → Tiptap Editor → JSON content → Supabase INSERT → Status: 'draft'
Researcher clicks Submit → Status: 'submitted' → Email notification to admins

### Review Process
Admin assigns reviewers → Status: 'under_review' → Email to reviewers
Reviewer opens proposal → ReviewEditor with annotation toolbar
Reviewer highlights text → Creates annotation (stored in annotations table)
Reviewer submits decision → Review record created → Status updated → Email to researcher

### Annotation Sync
Annotation created → Supabase INSERT → Realtime subscription fires → All connected clients update
Reply added → Same pattern → Sidebar thread updates in real-time

## Security Model
- Organization isolation via RLS policies on every table
- Role-based access within organizations
- Supabase Auth handles session management
- Next.js middleware validates auth on every request
- API routes verify organization membership + role before any mutation
