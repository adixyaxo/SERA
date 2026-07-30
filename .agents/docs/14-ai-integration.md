# AI Integration

SERA is an "AI-first" application, meaning artificial intelligence is not just a feature, but the core interaction paradigm for the app.

## AI Provider

SERA leverages **Google Gemini** models via the **Lovable AI Gateway**. This configuration provides the application with state-of-the-art natural language understanding and generation capabilities.

## Key AI Touchpoints

### 1. Smart Task Parsing
When a user types or speaks a prompt into the **Quick Capture** interface (e.g., "Remind me to call John tomorrow at 5 PM about the project"), the AI:
- Extracts the task name ("Call John about the project")
- Extracts the datetime context ("tomorrow at 5 PM")
- Infers priority or project tags.
- Returns a structured JSON payload to the frontend to optimistically create the task.

### 2. Conversational Assistant (`sera-assistant`)
The conversational interface allows users to ask questions about their schedule ("What do I have to do today?"). The assistant uses Function Calling / Tools to query the user's Supabase database (respecting RLS) and formulate a natural language response.

### 3. Voice Processing (`voice-processor`)
The frontend uses the Web Speech API to capture audio, which is then sent to the backend for refinement. The AI removes filler words, corrects domain-specific misspellings, and prepares the text for task execution.

### 4. Automated Planning (`sera-planner`)
For large projects, the AI can act as a project manager. A user can input "Plan my upcoming marketing campaign", and the `sera-planner` edge function will generate a multi-step Kanban board structure with estimated timelines and priority distributions.

## Architecture Flow

1. **Client** captures intent (Text/Voice).
2. **Client** sends an authenticated request to a **Supabase Edge Function**.
3. **Edge Function** constructs the prompt with user context and database schema context.
4. **Edge Function** calls the **Lovable AI Gateway (Gemini)**.
5. **Gemini** returns a structured response (usually JSON).
6. **Edge Function** parses the response and updates the Supabase Database if necessary.
7. **Client** receives the update via React Query or Realtime subscriptions and updates the UI.
