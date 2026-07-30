# Database Schema Details

## Primary Tables (Supabase PostgreSQL)
1. **profiles**: Extends `auth.users` with `full_name`, `avatar_url`, user settings (theme, notifications, timezone).
2. **cards**: Core entity representing tasks, events, and reminders. Highly flexible with JSONB metadata, GTD integration (priority, deadline, status).
3. **user_sessions**: Tracks user interaction sessions, storing denormalized arrays of cards in JSONB.
4. **projects**: Groups cards/tasks together with status tracking.
5. **tags**: User-defined life areas/tags with color coding.
6. **card_tags**: Junction table establishing Many-to-Many relationships between `cards` and `tags`.
7. **notes**: Standard text notes for users.
8. **events**: Calendar events with `start_time` and `end_time`.
9. **habits** & **habit_logs**: Habit tracking with frequency, targets, and completion logs.
10. **user_calibration**: Complex user preference table capturing productivity DNA, chronotype, and onboarding constraints.
11. **timetable_entries**: Recurring weekly schedule blocks.
12. **monk_tasks**, **monk_daily_plans**, **monk_journal_entries**, **monk_schedule_checkins**: Advanced feature tables for a strict "Monk Mode" productivity framework.

## Programmatic Elements
- **Stored Procedures (Functions)**:
  - `public.update_updated_at_column()`: Generic timestamp updater.
  - `public.handle_new_user()`: Auto-creates a `profiles` entry upon user signup.
  - `public.monk_carry_forward()`: Migrates uncompleted monk tasks to a new date.
- **Triggers**:
  - `BEFORE UPDATE` on nearly all tables (`profiles`, `cards`, `projects`, `notes`, `events`, `habits`, etc.) to fire `update_updated_at_column`.
  - `AFTER INSERT` on `auth.users` to fire `handle_new_user`.
