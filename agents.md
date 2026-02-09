# Agent Rules for EthicsGate

## Do
- Use TypeScript strict mode everywhere
- Use pnpm as the package manager
- Use shadcn/ui for all UI components — run `npx shadcn@latest add [component]` to install
- Use Tailwind CSS for all styling — no CSS modules or styled-components
- Use Zod for all form validation and API input validation
- Use Server Components by default, Client Components only when interactivity is needed
- Add 'use client' directive only to components that use hooks, event handlers, or browser APIs
- Write Supabase migrations as raw SQL files in supabase/migrations/
- Use Supabase Row Level Security on EVERY table — no exceptions
- Name files in kebab-case (e.g., annotation-sidebar.tsx)
- Name components in PascalCase (e.g., AnnotationSidebar)
- Handle loading states with Suspense boundaries and skeleton components
- Handle errors with error.tsx boundary files
- Use next/navigation for all routing (useRouter, redirect)
- Write descriptive commit messages
- Add proper TypeScript types — no `any` types allowed

## Don't
- Don't use Tiptap Cloud, Tiptap Collaboration, or any paid Tiptap features
- Don't use Tiptap's paid Comments extension — build our own annotation system
- Don't install @tiptap/extension-collaboration or @tiptap/extension-comments
- Don't use WidthType.PERCENTAGE in any document rendering
- Don't use localStorage for state management — use Supabase + React state
- Don't write raw SQL in API routes — use Supabase client methods
- Don't skip error handling on any async operation
- Don't use inline styles
- Don't create unnecessary abstractions — keep it simple for a prototype
- Don't use class components — functional components with hooks only
- Don't hard-code organization IDs or user IDs anywhere
- Don't skip RLS policies — every table needs them before going to production

## Tiptap Annotation Implementation
The annotation system is the CORE FEATURE. Implement it as:
1. A custom Tiptap Mark extension called 'annotation' that stores annotation_id and type (comment/concern/suggestion) as attributes
2. When reviewer selects text, show a floating bubble with annotation type options
3. On type selection, create the mark in the editor and POST to /api/annotations
4. Store the annotation in Supabase with the document position range
5. Render highlights using CSS classes: .annotation-comment (blue), .annotation-concern (red), .annotation-suggestion (yellow)
6. Build a sidebar that lists all annotations with threaded replies
7. Bidirectional scroll sync: click highlight → scroll sidebar, click sidebar item → scroll to highlight
8. Use Supabase Realtime to sync annotations between concurrent reviewers

## Testing
- Test the annotation system manually in the browser agent
- Verify RLS policies by testing with different user roles
- Verify email notifications fire correctly
- Test file upload with PDF and DOCX files
