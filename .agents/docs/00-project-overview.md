# Project Overview

## Description
SERA (Smart Everyday Routine Assistant) is an AI-first productivity application designed to help manage daily routines, tasks, projects, and notes with intelligent assistance. It is built with a React frontend and uses both Supabase Edge functions and a local FastAPI backend.

## Major Directories

- **`src/`**: Main frontend source code (React, TS). Contains UI components, routing pages, React contexts, and custom hooks.
- **`public/`**: Public static assets like `favicon.ico`, `robots.txt`, and media files.
- **`supabase/`**: Supabase configuration (`config.toml`), database migrations, and Edge functions.
- **`docs/`**: Project documentation and inventory.
- **`.lovable/`**: Lovable configuration and internal tooling.
- **`.venv/`**: Python virtual environment for the local FastAPI backend.

## Code Ownership by Module
- **Frontend Components (`src/components/`)**: Maintained by Frontend/UI developers.
- **Frontend Pages (`src/pages/`)**: Maintained by Frontend/UI developers.
- **State & Integrations (`src/contexts/`, `src/hooks/`, `src/integrations/`)**: Maintained by Frontend/Integration engineers.
- **Backend Edge Functions (`supabase/functions/`)**: Maintained by Backend engineers.
- **Database Migrations (`supabase/migrations/`)**: Maintained by Backend/Data engineers.
- **Local Python Backend**: Maintained by Backend/AI engineers.

## Source Files
- eslint.config.js
- generate_inventory.py
- index.html
- postcss.config.js
- tailwind.config.ts
- vite.config.ts
- src\App.css
- src\App.tsx
- src\index.css
- src\main.tsx
- src\vite-env.d.ts
- src\components\ProtectedRoute.tsx
- src\components\RootRedirect.tsx
- src\components\ScrollToTop.tsx
- src\components\Card\Card.css
- src\components\Card\Card.jsx
- src\components\dashboard\AdaptiveDashboard.tsx
- src\components\dashboard\ConfirmationDialog.tsx
- src\components\dashboard\DailyProgressCard.tsx
- src\components\dashboard\EnergySortedTasks.tsx
- src\components\dashboard\FloatingBackground.tsx
- src\components\dashboard\FocusModeCard.tsx
- src\components\dashboard\GTDAnalytics.tsx
- src\components\dashboard\GTDWidget.tsx
- src\components\dashboard\QuickCapture.tsx
- src\components\dashboard\QuickCaptureInbox.tsx
- src\components\dashboard\ScheduleCard.tsx
- src\components\dashboard\SmartTaskQueue.tsx
- src\components\dashboard\TasksWidget.tsx
- src\components\dashboard\TimeBlockView.tsx
- src\components\dashboard\TimelineWidget.tsx
- src\components\dashboard\TodayTimeline.tsx
- src\components\dashboard\VoiceOverlay.tsx
- src\components\gtd\CompletedTasksDialog.tsx
- src\components\gtd\KanbanBoard.tsx
- src\components\gtd\KanbanColumn.tsx
- src\components\gtd\TaskCard.tsx
- src\components\gtd\TaskDialog.tsx
- src\components\landing\CinematicIntro.tsx
- src\components\landing\PhoneMockup.tsx
- src\components\layout\Header.tsx
- src\components\layout\LandingNav.tsx
- src\components\layout\LiquidNavbar.tsx
- src\components\layout\SeraLogo.tsx
- src\components\layout\Sidebar.tsx
- src\components\monk\HabitRail.tsx
- src\components\Navbar\SystemNavbar.css
- src\components\Navbar\SystemNavbar.jsx
- src\components\onboarding\OnboardingFlow.tsx
- src\components\onboarding\OnboardingLayout.tsx
- src\components\onboarding\steps\CompletionStep.tsx
- src\components\onboarding\steps\ConstraintsStep.tsx
- src\components\onboarding\steps\EnergyMappingStep.tsx
- src\components\onboarding\steps\MethodologyStep.tsx
- src\components\onboarding\steps\PersonaStep.tsx
- src\components\onboarding\steps\ScenarioStep.tsx
- src\components\onboarding\steps\WelcomeStep.tsx
- src\components\sera\SeraFAB.tsx
- src\components\sera\SeraPlannerCard.tsx
- src\components\ui\about-page.tsx
- src\components\ui\accordion.tsx
- src\components\ui\alert-dialog.tsx
- src\components\ui\alert.tsx
- src\components\ui\animated-group.tsx
- src\components\ui\aspect-ratio.tsx
- src\components\ui\avatar.tsx
- src\components\ui\badge.tsx
- src\components\ui\bento-card.tsx
- src\components\ui\breadcrumb.tsx
- src\components\ui\button.tsx
- src\components\ui\calendar.tsx
- src\components\ui\card-curtain-reveal.tsx
- src\components\ui\card.tsx
- src\components\ui\cards.tsx
- src\components\ui\carousel.tsx
- src\components\ui\chart.tsx
- src\components\ui\checkbox.tsx
- src\components\ui\collapsible.tsx
- src\components\ui\command.tsx
- src\components\ui\context-menu.tsx
- src\components\ui\dialog.tsx
- src\components\ui\drawer.tsx
- src\components\ui\dropdown-menu.tsx
- src\components\ui\form.tsx
- src\components\ui\glowing-effect.tsx
- src\components\ui\hover-card.tsx
- src\components\ui\infinite-drag-scroll.tsx
- src\components\ui\infinite-slider.tsx
- src\components\ui\input-otp.tsx
- src\components\ui\input.tsx
- src\components\ui\label.tsx
- src\components\ui\link-preview.tsx
- src\components\ui\menubar.tsx
- src\components\ui\navigation-menu.tsx
- src\components\ui\pagination.tsx
- src\components\ui\popover.tsx
- src\components\ui\progress.tsx
- src\components\ui\progressive-blur.tsx
- src\components\ui\radio-group.tsx
- src\components\ui\resizable.tsx
- ... and 82 more.

## Configuration Files
- components.json
- eslint.config.js
- postcss.config.js
- tailwind.config.ts
- tsconfig.app.json
- tsconfig.json
- tsconfig.node.json
- vite.config.ts

## Documentation Files
- FEATURES_COMPLETED.md
- INTEGRATION_GUIDE.md
- README.md
- .lovable\plan.md
- public\robots.txt

## Asset Folders
- .venv\Lib\site-packages\celery\utils\static
- public
- src\assets

## Generated Code
- None found.

## Third-Party Integrations
- Supabase (Database, Auth, Edge Functions)
- Google Gemini (AI via Lovable)
- Vercel Analytics

## Scripts
- start-all.bat
- start-backend.bat
- start-frontend.bat
- tempCodeRunnerFile.bat
- .venv\Lib\site-packages\tqdm\completion.sh
- .venv\Scripts\activate.bat
- .venv\Scripts\Activate.ps1
- .venv\Scripts\deactivate.bat

## CI/CD Configuration
- None found.

## Docker Configuration
- None found.

## Environment Variables
- .env

## Package Managers
- bun.lock
- bun.lockb
- package-lock.json
- package.json
- requirements.txt

## Build Systems
- components.json
- eslint.config.js
- postcss.config.js
- tailwind.config.ts
- tsconfig.app.json
- tsconfig.json
- tsconfig.node.json
- vite.config.ts

