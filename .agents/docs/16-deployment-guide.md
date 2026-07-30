# Deployment Guide

SERA is designed to be deployed across two main platforms: Vercel (Frontend) and Supabase (Backend/Database).

## 1. Backend Deployment (Supabase)

The backend relies on Supabase projects. You can deploy it using the Supabase CLI.

### Prerequisites
- Install the [Supabase CLI](https://supabase.com/docs/guides/cli).
- Login via `supabase login`.
- Link your project: `supabase link --project-ref <your-project-ref>`.

### Deploying the Database
To push the local database migrations and schema to the remote project:
```bash
supabase db push
```

### Deploying Edge Functions
All edge functions located in `supabase/functions/` must be deployed to the cloud environment:
```bash
supabase functions deploy sera-assistant
supabase functions deploy sera-planner
supabase functions deploy sera-execute
supabase functions deploy voice-processor
supabase functions deploy process-text
supabase functions deploy card-action
supabase functions deploy get-user-cards
supabase functions deploy monk-insights
```

### Environment Secrets
Set any required secrets (like the Lovable API Gateway Key or OpenAI API key) for your Edge Functions:
```bash
supabase secrets set LOVABLE_API_KEY=your_key_here
```

## 2. Frontend Deployment (Vercel / Netlify)

The frontend is a standard Vite React application which can be deployed easily to any static hosting provider.

### Vercel (Recommended)
1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. The framework preset should automatically be detected as `Vite`.
4. Ensure the Build Command is `npm run build` or `bun run build`.
5. Ensure the Output Directory is `dist`.

### Environment Variables
For the frontend, you'll need to set the following environment variables in Vercel:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 3. Local Python Backend (Optional)

If utilizing the local FastAPI component found in `.venv`:
1. Ensure a production server environment (e.g., AWS EC2, DigitalOcean Droplet, or Heroku).
2. Install requirements: `pip install -r requirements.txt`.
3. Run via Uvicorn/Gunicorn: `uvicorn main:app --host 0.0.0.0 --port 8000`.
4. Ensure the frontend `VITE_API_URL` points to this hosted backend.
