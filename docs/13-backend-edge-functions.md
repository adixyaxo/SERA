# Backend & Edge Functions

SERA utilizes a serverless backend architecture primarily powered by **Supabase**.

## Supabase Infrastructure

- **PostgreSQL Database**: The core data store (analyzed deeply in `05-database-overview.md` through `11-schema-analysis.md`).
- **Supabase Auth**: Manages user authentication and Row Level Security (RLS).
- **Edge Functions**: Written in TypeScript/Deno and deployed globally via Supabase.

## Edge Functions Directory (`supabase/functions/`)

The application relies on several distinct Edge Functions to process complex business logic and AI interactions securely:

1. **`sera-assistant`**:
   The core conversational endpoint for the SERA AI. It receives natural language prompts, processes context, and returns actionable responses or structured data.

2. **`sera-planner`**:
   Responsible for organizing and scheduling tasks. It uses LLMs to break down complex projects into actionable steps and assign them to the user's GTD boards based on priority and energy levels.

3. **`sera-execute`**:
   Executes deterministic actions derived from AI interpretations (e.g., saving a parsed event to the database).

4. **`voice-processor`**:
   Handles audio transcripts received from the frontend's speech recognition layer, cleaning up the text and formatting it for intent extraction.

5. **`process-text`**:
   A generic text-processing utility function for summarizing notes, extracting keywords, or categorizing input.

6. **`get-user-cards` / `card-action`**:
   Functions handling specific UI state synchronizations and complex database transactions regarding task cards.

7. **`monk-insights`**:
   Generates personalized insights and analytics for the user based on their productivity history.

## Local Python Backend (Optional)

The project includes a `.venv` directory indicating a local Python backend (FastAPI/Celery) that can be run alongside the Supabase infrastructure. This is often used for heavy data processing, local LLM running, or batch analytics that exceed Edge Function timeout limits.
