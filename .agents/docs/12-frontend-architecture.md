# Frontend Architecture

This document provides a deep dive into the frontend architecture of the SERA application.

## Core Technologies

- **Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS & PostCSS
- **Animation**: Framer Motion & GSAP
- **Components**: Radix UI primitives & shadcn/ui library

## Directory Structure (`src/`)

- **`components/`**: Reusable UI blocks categorized by domains.
  - `dashboard/`: Widgets for the main dashboard (Quick Capture, Smart Task Queue, Daily Progress).
  - `gtd/`: Components related to Getting Things Done (Kanban Boards, Task Cards).
  - `layout/`: Global layout wrappers (Sidebar, Navbars, Header).
  - `sera/`: AI-specific UI elements (Sera Planner Card, FAB).
  - `ui/`: Core design system components from shadcn/ui.
  - `onboarding/`: The user onboarding flow steps.
  - `landing/`: Promotional landing page components.
- **`contexts/`**: React Contexts for global state management (e.g., Auth, Theme).
- **`hooks/`**: Custom React hooks to encapsulate business logic and data fetching.
- **`integrations/`**: Third-party integration setups (Supabase client).
- **`lib/`**: Utility functions, helpers, and constant configurations.
- **`pages/`**: Top-level route components representing distinct application views.

## State Management and Data Fetching

SERA primarily utilizes a combination of **React Context API** for global UI state (like themes and authentication) and **React Query (@tanstack/react-query)** for server state synchronization with Supabase. 

- **Optimistic Updates**: Used across GTD boards for smooth drag-and-drop interactions.
- **Drag and Drop**: Powered by `@dnd-kit` for the Kanban board interfaces.

## Routing

Routing is handled by **React Router DOM**. 
- Top-level routes are mapped to components in the `pages/` directory.
- `ProtectedRoute.tsx` wraps authenticated routes, redirecting unauthenticated users to the auth or landing page.

## Styling & Design System

The application relies heavily on **Tailwind CSS** for utility-first styling, customized via `tailwind.config.ts`.
- Complex dynamic components are animated using **Framer Motion**.
- The `shadcn/ui` components provide a consistent and accessible base design system.
