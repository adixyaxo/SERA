# Index Analysis

## Existing Indexes
- **Single-Column Indexes**:
  - `idx_cards_user_id` on `cards(user_id)`
  - `idx_cards_status` on `cards(status)`
  - `idx_sessions_user_id` on `user_sessions(user_id)`
- **Composite Indexes**:
  - `idx_monk_tasks_user_date` on `monk_tasks(user_id, plan_date)`

## Unique Constraints (Implicit Indexes)
Unique constraints automatically create B-Tree indexes:
- `tags(user_id, name)`
- `card_tags(card_id, tag_id)`
- `habit_logs(habit_id, date_string)` / `(habit_id, completed_date)`
- `monk_daily_plans(user_id, plan_date)`
- `monk_journal_entries(user_id, entry_date)`
- `monk_schedule_checkins(user_id, timetable_entry_id, check_date)`
- `profiles(email)`
- `user_sessions(session_id)`

## Missing Indexes (Optimization Opportunities)
Given that Row Level Security (RLS) forces virtually all queries to filter by `user_id = auth.uid()`, **Foreign Key indexes on `user_id` are critical for performance**. The following tables are missing explicit indexes on `user_id`, meaning queries might result in sequential table scans as data grows:
- `projects(user_id)`
- `tags(user_id)`
- `notes(user_id)`
- `events(user_id)`
- `habits(user_id)`
- `timetable_entries(user_id)`
- `user_calibration(user_id)`
- Also missing: `card_tags(tag_id)` (useful for querying all cards under a specific tag).
