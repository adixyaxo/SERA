# Table Analysis

## Normalization (3NF)
The schema demonstrates strong adherence to Third Normal Form (3NF) for its core relational data:
- Independent entities like `projects`, `tags`, and `cards` are separated.
- The Many-to-Many relationship between `cards` and `tags` is properly resolved using the `card_tags` junction table.

## Denormalization & JSONB Usage
To support flexibility, denormalization is strategically used via PostgreSQL's `JSONB`:
- `cards`: Uses `primary_action`, `alternatives`, and `metadata` as JSONB. This avoids entity-attribute-value (EAV) anti-patterns for highly dynamic task payloads.
- `user_sessions`: Stores a snapshot of cards inside a `cards` JSONB column.
- `user_calibration`: Uses JSONB for `energy_windows`, `blackout_hours`, and `priority_contacts`.

## Data Duplication
- **Intentional Duplication**: `user_sessions` caches `cards` data directly. This is acceptable for point-in-time session history.
- **SQLite Cache**: The local `sera.db` heavily duplicates Supabase's `cards` and `user_sessions` schemas, serving as a transient local cache.

## Unused Tables
- With the Python backend (`app/`) entirely missing from the repository, the local `sera.db` and its tables (`cards`, `user_sessions`, `user_preferences`) are likely completely unused in the current React-only execution context.
