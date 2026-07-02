## Overview

Full-stack backend build for Jhenaidah Zila Samiti site. Enables Lovable Cloud, adds authentication (roll/registration + Google), member directory DB, admin panels for notices/events/gallery, and role-based access (District Admin, Upazila Admin, Member).

## Auth model

- **Username = Roll Number, Password = Registration Number** — implemented as email/password under the hood: signup takes roll+reg+real email; we store `email = <roll>@zsru.local` for Supabase auth, keep real email in profile. Login form accepts roll+reg.
- **Google Sign-In** — via Lovable managed auth.
- **First-time bootstrap admin:** `rujhenaidah6@gmail.com` (as provided) auto-granted `district_admin` role via DB trigger on signup/verify.

## Database schema

- `profiles` — id (FK auth.users), roll_no (unique), reg_no, full_name, real_email, department, session, hall, upazila, phone, avatar_url, is_alumni, current_position
- `user_roles` — user_id, role (`district_admin | upazila_admin | member`), upazila (nullable, for upazila_admin scope). Separate table + `has_role()` security-definer function (per user-roles security rules).
- `notices` — id, title, body, date, level (`district|upazila`), upazila (nullable), created_by
- `events` — id, title, description, date, venue, level, upazila, created_by
- `gallery` — id, title, category, image_url, upazila (nullable), uploaded_by
- Storage buckets: `avatars` (public), `gallery` (public)

## RLS policies

- `profiles`: everyone signed in can read; user can update own; district_admin can update any.
- `user_roles`: user reads own; only district_admin can insert/update/delete.
- `notices` / `events`:
  - SELECT: public (anon + authenticated).
  - INSERT/UPDATE/DELETE: `district_admin` for district-level; `upazila_admin` for own upazila; `district_admin` can manage all.
- `gallery`: same pattern — public read, admins write.

## Frontend changes

- Replace `src/lib/data.ts` static arrays with live queries via TanStack Query + server functions using `requireSupabaseAuth` where needed; public reads via publishable client.
- New routes:
  - `/auth` — login (roll+reg OR Google) + register form.
  - `/_authenticated/dashboard` — admin dashboard (stats, quick actions).
  - `/_authenticated/admin/notices` — CRUD.
  - `/_authenticated/admin/events` — CRUD.
  - `/_authenticated/admin/gallery` — upload + delete.
  - `/_authenticated/admin/members` — approve/edit (district admin).
  - `/_authenticated/profile` — edit own profile.
- Header: show account menu when logged in; "লগইন" when out. Sign-out clears cache.
- Members/Alumni/Notices/Events/Gallery pages → read live from DB, keep search & filters.

## Roles UX

- Upazila admin sees only their upazila's notices/events/gallery management.
- District admin sees everything + can promote users to upazila admin.

## Out of scope (unless asked later)

- Payment/donations, blood-donor DB, email notifications, real-time chat.

## Delivery order

1. Enable Cloud + configure Google auth.
2. Migrations: tables, roles, triggers, RLS, storage buckets.
3. Auth pages + header wiring.
4. Data-layer server functions + refactor existing pages to live data.
5. Admin CRUD pages.
6. Verify build & smoke-test key flows.

Reply "go" to start, or tell me what to change.