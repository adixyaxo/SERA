# Technology Stack

## Frontend Layer
- **Core**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion, postcss, tailwindcss-animate
- **UI Components**: shadcn/ui, Radix UI, lucide-react
- **Routing**: react-router-dom
- **State Management / Data Fetching**: @tanstack/react-query

## Backend Layer (Node/Edge Functions)
- **Platform**: Supabase (Lovable Cloud)
- **Database**: PostgreSQL (via Supabase), SQLite (sera.db)
- **Auth**: Supabase Auth, @lovable.dev/cloud-auth-js
- **Functions**: Deno (Supabase Edge Functions)

## Backend Layer (Python)
- **Framework**: FastAPI, Uvicorn
- **AI**: Google GenAI (`google-genai`, `google-generativeai`)
- **Database**: SQLAlchemy, psycopg2-binary, aiosqlite
- **Task Queue / Cache**: Celery, Redis
- **Validation**: Pydantic

## Integrations
- **AI**: Google Gemini via Lovable AI Gateway
- **Analytics**: @vercel/analytics

## Build & Tooling
- **Package Managers**: npm, bun
- **Code Quality**: ESLint, TypeScript
