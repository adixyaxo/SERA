# SERA — Smart Everyday Routine Assistant

<div align="center">
  <img src="https://img.shields.io/badge/React-18.3-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-3.4-blue?style=for-the-badge&logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Supabase-Cloud-green?style=for-the-badge&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/AI-Gemini-orange?style=for-the-badge&logo=google" alt="Gemini AI" />
</div>

## 🌟 Overview

**SERA** (Smart Everyday Routine Assistant) is an AI-first productivity application designed to help you manage your daily routines, tasks, projects, and notes with intelligent assistance. Built with modern web technologies and powered by Google's Gemini AI, SERA offers a seamless experience for organizing your life through both text and voice interactions.

## ✨ Key Features

- **🧠 AI-Powered Assistant**: Natural language and voice commands powered by Google Gemini to create tasks, organize schedules, and manage workflows.
- **📋 GTD Task Management**: Kanban board approach (NOW / NEXT / LATER) to intuitively sort priorities, deadlines, and project associations.
- **📅 Unified Calendar**: A single pane of glass for events, project deadlines, and daily tasks.
- **📁 Projects & Notes**: Organize tasks into projects with visual progress indicators and create rich text notes synced to the cloud.
- **📊 Analytics & Insights**: Track productivity streaks, view completion rates, and manage energy levels.
- **🎤 Voice & Quick Capture**: Browser-native speech recognition integrated directly with AI processing for hands-free management.

## 🏗️ Architecture & Tech Stack

SERA follows a modern full-stack architecture utilizing:

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, and shadcn/ui.
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions written in Deno).
- **AI Integration**: Google Gemini models via Lovable AI Gateway.
- **Local Services**: Optional FastAPI Python backend integration for advanced data handling and local AI processing.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or bun

### Installation

1. **Clone & Install**
   ```bash
   git clone <repository-url>
   cd sera
   bun install # or npm install
   ```

2. **Run Development Server**
   ```bash
   bun run dev # or npm run dev
   ```

3. **Open Application**
   Navigate to `http://localhost:5173` in your browser.

## 📚 Documentation Structure

For deep architectural insights, refer to the `docs/` folder:

- `00-project-overview.md` - Complete project layout.
- `04-folder-structure-analysis.md` - Source tree deep dive.
- `06-database-schema.md` & `08-relations.md` - Database and schema design.
- `12-frontend-architecture.md` - Frontend setup and routing.
- `13-backend-edge-functions.md` - Supabase and backend logic.
- `14-ai-integration.md` - AI and LLM integrations.
- `15-user-flow.md` - Application flow and onboarding.

---

<div align="center">
  <strong>SERA — Your Smart Everyday Routine Assistant</strong><br />
  <em>Focus. Clarity. Discipline. Systems over motivation.</em>
</div>
