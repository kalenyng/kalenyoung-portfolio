---
title: Budget Tracker
tagline: Astro + Supabase cash-flow tracker. Personal project, actively developed.
role: Personal project · active
year: 2025
featured: true
flagship: false
tech:
  - Astro
  - Supabase
  - PostgreSQL
  - TypeScript
cover: /images/projects/budget-app-cover.webp
---

This one exists because I needed it. I track my monthly finances with it, which means every rough edge surfaces fast and every missing feature is genuinely annoying. That's a different forcing function than building a demo.

The core problem it solves: know where your money is going, know where it's heading, and get a warning before the heading becomes a problem.

## The data model

Six tables. `categories` defines your expense labels, each typed as either `fixed` (rent, subscriptions) or `variable` (food, fuel). They carry a `monthly_amount` as a default budget and an optional group and sort order. `budgets` is a per-category, per-calendar-month record with two fields: `budget_amount` (what you planned) and `actual_amount` (what you spent). The split matters because planned and actual are separate concerns and conflating them creates reporting problems.

`transactions` holds raw imported bank lines. `date`, `description`, `amount`, `category_id`, `month`. On commit, expense rows are upserted into `transactions` and category totals are recomputed and written back to `budgets.actual_amount` for that month. That recompute step is the link between raw data and the budget view.

`incomes` tracks named income sources per month. Template rows use a sentinel value of `1970-01-01` as the month so they stay queryable without colliding with real months. When a new month is opened, templates clone forward automatically.

`monthly_balances` is a single running balance per user per month: `starting_balance` and `ending_balance`. The ending balance of month N carries forward as the starting balance of N+1. There is no multi-account or wallet layer. Everything rolls into one envelope.

`user_settings` stores key-value preferences: preferred currency, display mode, conversion toggles.

There is no separate bills table and no recurrence engine. Fixed categories serve as the bill layer. A subscription or standing order is a fixed category with a `monthly_amount`. The due date is not modeled, just the expected cost.

## The forecast logic

The app runs on a South African financial year, April to March. All projection math is anchored there. `getMonthsElapsed` counts how many FY months have started, including the current partial month, and handles the calendar split: months before April belong to the prior FY year.

Projection is linear burn rate extrapolation. Given months elapsed and actual spend to date, it computes what you should have spent by now on a straight line, what your burn rate implies for the full year, and what the gap is between that projection and your annual budget. Five numbers, one formula, clear output.

The insights engine in `src/lib/insights.ts` consumes those numbers and applies a set of explicit rules. Year-end projection over budget triggers a critical insight. Overall pace deviating more than 0.5% of total budget from expected triggers critical or good depending on direction. Variable categories that have used 80% or more of their annual budget before 60% of the year has elapsed get flagged as at risk. Fixed categories are excluded from pace rules entirely — hitting plan is expected for a fixed cost.

The FY status bar on the yearly dashboard maps spend difference as a percentage of total budget to one of three states: on track at under 2% over, slightly over at under 8%, overspending beyond that. Green, amber, red. The thresholds are explicit and documented in code rather than eyeballed.

## What "calls attention early" looks like

Colour and copy, not push notifications. Every insight renders with a coloured left border: red for critical, amber for warning, green for good. A dot, a title, a message. On desktop the month page adds a reconciliation bar that compares the computed ending balance against the manually entered one and flags a mismatch in red. If `cashRemaining` goes negative the page shows a "you ran out of money this month" banner. Category cards turn amber at 80% of annual budget used and red at 100%.

The mobile dashboard surfaces shortened insight lines but the full insights charts and the `/insights` page are desktop-only. That's a known gap.

## The "you cannot spend money twice" constraint

It maps to two separate mechanisms.

At the database level: `transactions` has a unique constraint on `(user_id, month, date, description, amount)`. Re-importing the same bank line upserts rather than duplicates. If a row has been manually edited, it is protected from overwrite on re-import.

<div class="callout">

At the reporting level: carried-over balances from `monthly_balances` are intentionally excluded from yearly income rollups. The money was already counted when it entered the account in a prior month. Adding it again would inflate income totals. This is an app-level rule documented in code comments, not a database constraint.

</div>

## The date math

The April–March split is the main source of complexity. January through March belong to the FY that started the previous April. `getMonthsElapsed` handles this with a branch: April through December use `month - 3`, January through March use `month + 9`. The partial current month is always included in elapsed count, which means expected spend is calculated assuming you're mid-month, not only counting completed months.

The same FY month-list builder is duplicated across `app.astro`, `insightsPageData.ts`, and `mobileDashboardInsights.ts`. That's a maintenance footgun and it's on the list.

Transaction dates are stored as text to handle flexible CSV formats. Deduplication before upsert happens in app code to avoid Postgres "cannot affect row a second time" errors on batch commits.

## What's rough

The app uses AI-assisted categorisation via OpenRouter and a Supabase edge function. It's optional and can fail silently. The PWA shell exists but the service worker is pass-through — no real offline cache. The Supabase client in `src/lib/supabase.ts` has hardcoded URL and anon key fallbacks and debug logging left in, not production-hardened.