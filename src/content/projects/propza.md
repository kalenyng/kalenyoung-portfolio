---
title: Propza
tagline: Angular + Supabase property-management SaaS. The learning build I use to show I can ship product UIs.
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

## Context

Propza started as a learning project to prove I can carry a product-shaped frontend end-to-end: auth flows, domain data in Supabase, forms that stay coherent as operators move fast. Core logic is done. I refine it when time allows, but it exists as a demo of how I think about product UI, not as a shipping product.

## What I owned

End-to-end product UI in Angular, Supabase schema and client integration, and the product decisions that sit between mock and shippable — empty states, loading behaviour, validation placement. The details that make a product feel intentional.

## Highlights

- Real SaaS-shaped surfaces (not a marketing shell): lists, forms, and guard rails around destructive actions.
- Supabase-backed data with PostgreSQL underneath — the same stack I use on smaller personal builds, scaled up for a coherent demo.
- TypeScript-first components with an eye toward maintainability as the feature set grows.

## Technical notes

Angular for structure and long-lived forms; Supabase for auth and data APIs without building a bespoke backend. This is what I show when someone asks for a product sample beyond brochure sites. It's not a shipped product, but it proves I can think in product terms: what breaks at scale, where UX compounds, how to structure for maintainability.
