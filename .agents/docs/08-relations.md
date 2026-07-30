# Relations & Integrity

## Relationship Topology
- **One-to-One (1:1)**:
  - `auth.users` <-> `profiles` (Extended user data).
  - `auth.users` <-> `user_calibration` (User configuration).
- **One-to-Many (1:N)**:
  - Users own multiple entities: `cards`, `projects`, `tags`, `habits`, `notes`, `events`, `timetable_entries`, `monk_tasks`.
  - `habits` (1) to `habit_logs` (N).
  - `monk_tasks` (1) to `monk_daily_plans` (N) via `frog_task_id`.
- **Many-to-Many (M:N)**:
  - `cards` <-> `tags` (Resolved via `card_tags`).

## Relationship Integrity (Constraints & FKs)
- **Foreign Keys**: Almost every table strictly references `auth.users(id)` or `profiles(id)`.
- **Cascading Deletes**: `ON DELETE CASCADE` is universally applied on user-bound foreign keys. Deleting a user safely wipes all their projects, cards, habits, tags, and logs without leaving orphan records.
- **Check Constraints**: Enforce strict domains:
  - `cards.type IN ('schedule', 'reschedule', 'cancel', 'reminder', 'task')`
  - `cards.priority IN ('low', 'medium', 'high')`
  - `timetable_entries.day_of_week` between 0 and 6.
