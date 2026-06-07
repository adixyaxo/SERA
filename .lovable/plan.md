
# Monk Mode — Build Plan

A new core tab at `/monk` that becomes SERA's discipline operating system. Replaces the standalone Tracker entry in the nav (Tracker route remains for back-compat but is absorbed visually here). Minimal, calm, mobile-first.

## Information architecture

Single page `/monk` with 5 internal sub-views (segmented control, not separate routes — keeps it fast and one-tap):

1. **Today** — Frog task + planned tasks + habit rail + quick journal
2. **Plan Tomorrow** — Next-day intention builder
3. **Accountability** — Timetable planned vs actual
4. **Journal** — Daily reflection history
5. **Insights** — Growth analytics + AI patterns

Top nav gets a new "Monk" tab inserted between Timetable and Tracker. Tracker tab is removed from primary nav (data still flows via the existing `habits` table — no migration loss).

## Data model (new tables only)

```text
monk_daily_plans     one row per (user, date)
  ├─ frog_task_id    fk to monk_tasks (nullable)
  ├─ intention       text
  ├─ energy_forecast int (1-5)
  └─ planned_at      timestamp

monk_tasks           daily execution tasks (separate from GTD `cards`)
  ├─ user_id, plan_date, title, estimate_minutes
  ├─ priority (low|med|high|frog)
  ├─ order_index, completed_at
  ├─ postpone_count  (auto-incremented on carry-forward)
  └─ origin_date     (first date it appeared)

monk_journal_entries one row per (user, date)
  ├─ went_well, time_wasted, improve_tomorrow  (text)
  ├─ energy (1-5), clarity (1-5), mood
  └─ free_form (markdown)

monk_schedule_checkins  per timetable block actual execution
  ├─ user_id, timetable_entry_id, date
  ├─ status (followed|partial|skipped)
  └─ note
```

All with strict RLS (`auth.uid() = user_id`) and proper GRANTs.

## Smart carry-forward

A SQL function `monk_carry_forward(user_id, from_date, to_date)` called on first visit of a new day: any incomplete `monk_tasks` from yesterday get `plan_date := today`, `postpone_count += 1`. UI shows "Postponed ×N" badge; ×3+ flips the card to a "streak break risk" warning state.

## AI features (Lovable AI / Gemini)

New edge function `monk-insights`:
- Adaptive planning suggestions (input: last 14 days of completion + energy)
- Burnout detection (overload + low-energy streak)
- Weekly review generation (Sunday)
- Pattern insights ("you perform best 7-10pm")

Uses `google/gemini-2.5-flash` for speed/cost.

## UI principles

- Monochrome base, single accent (existing primary)
- Generous whitespace, large hit targets (44px+ mobile)
- One-tap habit completion, swipe-to-complete on task rows (mobile)
- No confetti, no badges, no streak fire spam — minimal restrained motion
- Glass surfaces consistent with rest of app, but lighter (less blur, no glow)

## Files to add

```text
src/pages/MonkMode.tsx                      page shell + sub-view router
src/components/monk/MonkHeader.tsx          date + segmented control
src/components/monk/TodayView.tsx           dashboard composition
src/components/monk/FrogCard.tsx            highlighted primary task
src/components/monk/TaskList.tsx            daily tasks w/ reorder, carry-forward badges
src/components/monk/HabitRail.tsx           horizontal habit row (reuses habits table)
src/components/monk/QuickJournal.tsx        inline reflection prompts
src/components/monk/PlanTomorrowView.tsx    next-day builder
src/components/monk/AccountabilityView.tsx  timetable adherence
src/components/monk/JournalView.tsx         history + long-form editor
src/components/monk/InsightsView.tsx        analytics + AI insights
src/hooks/useMonkDay.ts                     loads/saves plan+tasks+journal for a date
src/hooks/useMonkInsights.ts                calls edge function
supabase/functions/monk-insights/index.ts   Gemini-powered analytics
```

## Files to edit

```text
src/App.tsx                                 add /monk route
src/components/layout/LiquidNavbar.tsx      add Monk tab, remove Tracker tab
src/components/layout/Header.tsx            same
```

## Migration (one call, awaiting approval)

Creates the 4 tables above + `monk_carry_forward` function + grants + RLS + updated_at triggers.

## QA checklist before sign-off

- Carry-forward runs once per day, no duplicates
- Empty states on every sub-view
- Mobile breakpoints 320/375/768
- Offline write queue → toast on reconnect
- Journal autosave debounce 600ms
- Habit toggle optimistic with rollback on error
- No console errors on `/monk` cold load

## Out of scope (ask later)

- Push notifications (needs PWA, explicitly deferred earlier)
- Voice-to-text in journal (can layer on existing `useVoiceInput`)
- Social accountability / sharing
