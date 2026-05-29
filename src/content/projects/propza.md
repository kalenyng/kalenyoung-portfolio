---
title: Propza
tagline: Angular + Supabase product UI — auth flows, domain data, operator-grade form handling and empty states.
role: Product UI · Angular
year: 2025
featured: true
flagship: true
tech:
  - Angular
  - TypeScript
  - Supabase
  - PostgreSQL
cover: /images/projects/propza-cover.webp
---

Propza is a property-management SaaS UI built end-to-end in Angular and Supabase. The brief was self-imposed and product-shaped: real domain, real auth, real data model, real empty states — the kind of surface area that separates a prototype from something a team could ship.

The domain is property management. South African landlords, ZAR, one owner with multiple properties, each property with a tenant and a running payment ledger. Simple enough to scope, complex enough to surface real problems.

## The data model

The schema is three core tables. `properties` is the primary asset, owned by the authenticated user via `owner_id`. `tenants` hangs off `properties` with a `CASCADE` delete. `payments` records rent by `property_id` and `period` (YYYY-MM).

Two more tables exist in practice but not cleanly in migrations. `profiles` stores display name, theme preference, and notification settings keyed to `auth.users.id`. There's no `CREATE TABLE` migration for it in the repo. RLS policies for it are wrapped in `IF EXISTS`, which means a fresh project fails silently. That's a known issue and it's documented. `tenancies` is a legacy table that still gets written to during the add-property flow but has largely been superseded by `tenants`. It needs deprecating.

One of the more interesting schema decisions was around partial payments. Migration 002 added a `UNIQUE(property_id, period)` constraint, one payment per property per month. Migration 006 dropped it to allow partial payments. The app had to adapt: the payment form aggregates partials, and the property detail view had retry logic that would increment the YYYY-MM period on a `23505` duplicate-key error, left over from the one-payment-per-period era.

## Auth

Email and password sign-in and sign-up, Google OAuth, and password reset via email. No magic link, no multi-role RBAC. Isolation is handled by `owner_id` plus RLS, not application-level roles.

`AuthService` uses Angular signals for session state. Guards are functional `CanActivateFn` using `inject()`. The `authGuard` waits for the initial `getSession()` call to resolve before evaluating, so a hard refresh doesn't flash the login screen for authenticated users.

There's a beta gate, which is friction-only. A 6-digit code, base64-compared against an env variable, stored in `localStorage`. It's documented as not being a real security boundary. Anyone in DevTools can bypass it in under a minute.

<div class="callout">

The RLS setup has a real issue worth calling out. Migrations 001 and 003 created permissive policies scoped only to `auth.uid() IS NOT NULL`. Migration 004 added the correct owner-scoped policies but never dropped the old ones. Postgres ORs policies, so if both sets are active, cross-tenant data leakage is possible on `SELECT`. Migration 008 hardened payments specifically by dropping all payment policies and recreating a strict set. The other tables still need the same treatment.

</div>

## Forms

The most complex form in the app is the add-property modal. It handles address fields, rent amount, an "occupied" toggle that conditionally shows tenancy fields, a custom ZA date picker (`dd/mm/yyyy` display with a hidden native input underneath), an optional lease file upload to Supabase Storage, and a "currently paid" toggle that records an initial payment row. On submit it chains inserts across `properties`, `tenancies`, `tenants`, and optionally `payments`, with per-step error toasts if any write fails partway through.

The add-tenant modal follows a similar pattern: vacant-property picker, auto-filled rent amount from the selected property, optional contact validators, and the same "currently paid" path.

Password reset listens for the `PASSWORD_RECOVERY` event from `onAuthStateChange`, with an 800ms session fallback for cases where the event fires before the listener is ready. Small detail, but the kind of thing that breaks in production if you don't handle it.

Both modals use reactive forms with `FormBuilder`. Login and the inline detail editors use template-driven forms with `ngModel`. The split is deliberate: reactive forms where there's conditional logic or cross-field validation, template forms where the interaction is simpler.

## Rent status logic

Rent status is computed, not stored as a static enum. `RentDueService` is the authoritative service: it takes a tenant's `rent_due_date` and walks payment records forward to find the first unpaid period. Status comes out as `paid`, `overdue`, `upcoming`, or `partially_paid`. All date math accounts for ZA timezone (UTC+2).

There's a second service, `RentHelperService`, which covers older status and period logic including weekly payment paths. The two services overlap and consolidation is on the issues list. It's the kind of thing that accumulates when you're iterating fast.

## Empty states and guardrails

Every list has two empty states: one for no data at all ("you haven't added any properties yet") and one for filtered-empty ("no results match your search"). They're different and they're handled separately. Conflating them is a common shortcut that makes products feel unfinished.

Destructive actions use `ConfirmationModalService`, a promise-based modal that doesn't dismiss on backdrop click. Delete account requires typing `delete` and checking an acknowledgement box. Record payment blocks submission if amount is zero, rent due date is missing, or tenant ID is absent.

`SanitizationService` runs on all text, address, email, phone, and notes fields before any Supabase write. It's a single choke point for XSS and DB write safety.

## Architecture

<div class="stat-row">
  <div><span class="stat-number">12</span><span class="stat-label">Routes</span></div>
  <div><span class="stat-number">14</span><span class="stat-label">Core services</span></div>
  <div><span class="stat-number">5</span><span class="stat-label">DB tables</span></div>
</div>

The entire app is standalone components, no NgModules. State is split between signals in `AuthService` and `BehaviorSubject` observables in `PropertyService` and `TenantService`, which subscribe to a shared `refreshAll$` bus on `SupabaseService`. Mutations trigger `refreshAll$`, which fans out to both services and causes subscribed views to re-render.

All routes are eagerly loaded. That's a known issue and a straightforward fix with lazy loading. It's on the list.

I documented the full architecture in an interactive map, including all 17 known issues ranked by severity with remediation paths. It covers the data flows, schema, RLS timeline, and component tree. The 17 issues being visible isn't something I'm hiding. I found them, I understand them, and I know how to fix them. That's the point of the exercise.
