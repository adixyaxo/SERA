# Database Overview

## Architecture & Databases
The project relies on a dual-database architecture:
1. **Primary Database (Remote)**: PostgreSQL hosted on Supabase. This serves as the single source of truth, enforcing business logic, relational integrity, and security via Row Level Security (RLS).
2. **Local Caching Database (Local)**: A local SQLite database (`sera.db`) residing in the project root. It appears designed for local caching and session storage (likely by the missing Python backend).

## Migrations & Schemas
- **Supabase Migrations**: Located in `supabase/migrations/*.sql`. The schema was progressively built from an initial schema through various iterative updates (adding GTD fields, Monk Mode features, tags, and habits).
- **Schemas**: The primary schema used is `public`. Supabase's internal `auth` schema manages users.

## Application Interface (ORM/Queries)
- **ORMs**: No explicit ORM models (like Prisma, SQLAlchemy, or Django) were identified in the available source code, as the Python backend `app/` is missing. The frontend interacts with Supabase directly via the `@supabase/supabase-js` client SDK.
- **SQL Queries**: Hardcoded in migration files defining schemas, triggers, and stored procedures.

## Specialized Implementations
- **Soft Deletes**: Implemented on the `habits` table via an `archived` boolean flag. All other tables rely on hard deletes (`ON DELETE CASCADE`).
- **Audit Tables**: No dedicated append-only audit tables exist. Record history is managed loosely via `created_at` and `updated_at` timestamps on almost every table.
- **Caching Tables**: The local `sera.db` contains `cards`, `user_sessions`, and `user_preferences` tables, heavily relying on JSON/TEXT blobs to cache data.
