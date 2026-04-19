# Phase 1 – Technical Implementation Plan

## Goal
Set up a stable, self-hostable foundation for weFactly without building feature modules.

This phase delivers only:
- application bootstrap
- database foundation
- first-time setup flow
- normal login flow
- protected app shell
- design system base

It explicitly does **not** include:
- customers
- products
- quotes
- invoices
- PDF generation
- mail sending
- role management
- module system implementation

---

## 1. Final folder structure

## Root
- app/
- src/
- database/
- docker/
- docs/
- scripts/

## app/
Purpose: backend runtime and API bootstrap.

Planned files:
- app/server.ts
- app/routes/health.ts
- app/routes/setup.ts
- app/routes/auth.ts
- app/middleware/auth.ts

## src/
Purpose: frontend application.

### src/app/
Routes, screens, route guards and app composition.

Planned structure:
- src/app/App.tsx
- src/app/router.tsx
- src/app/routes/setup-page.tsx
- src/app/routes/login-page.tsx
- src/app/routes/dashboard-page.tsx
- src/app/routes/settings-page.tsx
- src/app/guards/require-auth.tsx
- src/app/guards/require-setup.tsx

### src/components/
Reusable UI and layout building blocks.

Planned structure:
- src/components/layout/app-shell.tsx
- src/components/layout/app-sidebar.tsx
- src/components/layout/app-header.tsx
- src/components/shared/page-header.tsx
- src/components/ui/button.tsx
- src/components/ui/input.tsx
- src/components/ui/label.tsx
- src/components/ui/card.tsx
- src/components/ui/badge.tsx
- src/components/ui/alert.tsx
- src/components/ui/spinner.tsx

### src/config/
Application configuration objects if needed later.

For phase 1 this remains minimal.

### src/lib/
Core non-UI logic.

Planned structure:
- src/lib/config/env.ts
- src/lib/db/client.ts
- src/lib/db/mappers.ts
- src/lib/auth/password.ts
- src/lib/auth/session.ts
- src/lib/auth/auth-service.ts
- src/lib/bootstrap/setup-status.ts
- src/lib/bootstrap/bootstrap-service.ts
- src/lib/validation/setup-schema.ts
- src/lib/validation/login-schema.ts
- src/lib/utils/date.ts
- src/lib/utils/result.ts

### src/types/
Shared domain and API types.

Planned files:
- src/types/domain.ts
- src/types/auth.ts
- src/types/settings.ts

### src/styles/
Global styling and design tokens.

Planned files:
- src/styles/globals.css
- src/styles/tokens.css

### src/api/
Reserved for frontend API client wrappers.
No feature-specific API clients yet.

### src/hooks/
Only add hooks if shared behavior truly repeats.
Keep empty or minimal in phase 1.

### src/modules/
Reserved only.
No feature module implementation in phase 1.

### src/pages/
Not used as the main route structure in phase 1.
Keep empty or remove later for clarity.

---

## 2. First files to create

## Root config
- package.json
- tsconfig.json
- vite.config.ts
- index.html
- .env.example
- .gitignore

## Frontend entry
- src/main.tsx
- src/app/App.tsx
- src/app/router.tsx

## Public screens
- src/app/routes/setup-page.tsx
- src/app/routes/login-page.tsx

## Protected screens
- src/app/routes/dashboard-page.tsx
- src/app/routes/settings-page.tsx

## Layout
- src/components/layout/app-shell.tsx
- src/components/layout/app-sidebar.tsx
- src/components/layout/app-header.tsx
- src/components/shared/page-header.tsx

## UI base
- src/components/ui/button.tsx
- src/components/ui/input.tsx
- src/components/ui/label.tsx
- src/components/ui/card.tsx
- src/components/ui/badge.tsx
- src/components/ui/alert.tsx
- src/components/ui/spinner.tsx

## Core logic
- src/lib/config/env.ts
- src/lib/db/client.ts
- src/lib/auth/password.ts
- src/lib/auth/session.ts
- src/lib/auth/auth-service.ts
- src/lib/bootstrap/setup-status.ts
- src/lib/bootstrap/bootstrap-service.ts
- src/lib/validation/setup-schema.ts
- src/lib/validation/login-schema.ts

## Server/API bootstrap
- app/server.ts
- app/routes/health.ts
- app/routes/setup.ts
- app/routes/auth.ts

## Database
- database/migrations/001_create_organizations.sql
- database/migrations/002_create_users.sql
- database/migrations/003_create_settings.sql
- database/migrations/004_add_constraints_and_indexes.sql

---

## 3. Responsibility per area

## app/
Owns request handling, auth endpoints, setup endpoints and health checks.
No UI here.

## src/app/
Owns route flow and page composition.
No direct database logic.

## src/components/
Owns reusable UX patterns and layout consistency.
No business logic.

## src/lib/
Owns configuration, validation, auth logic, setup logic and database access helpers.

## database/
Owns schema evolution and data integrity.

---

## 4. Initial database design

## organizations
Purpose: company context and basic business identity.

Suggested columns:
- id
- name
- email
- phone
- website
- registration_number
- tax_number
- address_line_1
- address_line_2
- postal_code
- city
- country
- created_at
- updated_at

Notes:
- no unnecessary status field here in phase 1
- one record in v1, but not hardcoded in the architecture

## users
Purpose: admin identity, login and future user expansion.

Suggested columns:
- id
- organization_id
- full_name
- email
- password_hash
- is_active
- last_login_at
- created_at
- updated_at

Notes:
- no full roles system yet
- one admin user in v1
- structure supports later expansion to multiple internal users

## settings
Purpose: central app and organization settings, kept simple in one table for v1.

Suggested columns:
- id
- organization_id
- currency
- locale
- timezone
- invoice_number_prefix
- invoice_number_next_value
- quote_number_prefix
- quote_number_next_value
- created_at
- updated_at

Notes:
- keep one central settings table now
- code should access settings via a service layer so later splits into document, mail or organization settings do not require rewrite

## Metadata principle
Use metadata only where it has real functional value.

Always include:
- created_at
- updated_at

Keep room for later fields such as:
- finalized_at
- sent_at
- archived_at

Add them later where business flow truly requires them.

---

## 5. Migration order

## Migration 001
Create organizations table.

Why first:
- users and settings depend on organization context

## Migration 002
Create users table with foreign key to organizations.

Why second:
- first setup creates admin user after organization creation

## Migration 003
Create settings table with foreign key to organizations.

Why third:
- setup flow creates default settings for the new organization

## Migration 004
Add indexes, uniqueness and safety constraints.

Examples:
- unique organization email if desired later
- unique user email
- indexes on organization_id
- created_at defaults
- updated_at update strategy

This keeps the core schema readable and predictable.

---

## 6. Setup-check flow

## Goal
Show the setup flow only when the system is still uninitialized.

## Simple execution flow
1. App starts
2. frontend asks backend for setup status
3. backend checks whether an admin user already exists
4. if no admin exists:
   - allow access only to setup screen
   - block normal login as the primary entry
5. if admin exists:
   - setup route becomes unavailable
   - redirect to login

## Setup form data
Minimum fields:
- business name
- admin full name
- admin email
- password
- core business details

## On submit
1. validate input
2. create organization record
3. create admin user linked to organization
4. create default settings record
5. mark system as initialized by data presence, not by a separate flag
6. redirect to login

## Security rules
- setup only allowed while no admin exists
- password stored only as a hash
- no public re-entry after completion
- validation on both client and server

---

## 7. Login flow

## Goal
Provide the first standard access path after setup.

## Flow
1. user opens login page
2. enters email and password
3. backend validates credentials
4. session is created
5. user is redirected to dashboard placeholder

## Required phase 1 pieces
- login form
- auth endpoint
- password verification
- session cookie or token strategy
- logout action
- route guard for protected screens

## Not in scope now
- password reset
- e-mail verification
- invite flows
- advanced role checks

---

## 8. App-shell structure

## Goal
Make the product feel stable and professional from day one.

## Shell parts
- sidebar
- top header
- main content area
- page header area for title and actions

## Navigation in phase 1
Visible items:
- Dashboard
- Settings

Optional disabled placeholders:
- Customers
- Products
- Quotes
- Invoices

These may be shown only if this helps the product feel complete, but they should clearly remain non-functional placeholders.

## UX rules for the shell
- consistent spacing
- fixed action placement
- quiet visual style
- responsive but desktop-first
- no clutter

---

## 9. Design system base

## Objective
Create a small, stable visual foundation that every later module must follow.

## Base decisions
- clean typography
- restrained color palette
- limited radius and shadow usage
- clear hierarchy in forms and tables
- direct feedback states

## Must-have primitives
- button
- input
- label
- card
- badge
- alert
- spinner
- empty state

## Phase 1 rule
Only build primitives that are immediately needed for:
- setup form
- login form
- shell layout
- settings placeholder

No large component library expansion yet.

---

## 10. Placeholder boundaries

The following remain placeholders in phase 1:
- dashboard data
- customer flows
- product flows
- quote flows
- invoice flows
- number allocation logic at send/finalize stage
- PDF generation
- mail delivery
- multi-user management
- role management
- module extensions

This is intentional.

---

## 11. Recommended execution order

1. initialize project tooling
2. add global styles and design tokens
3. create app shell and public pages
4. add database client and migrations
5. implement setup-status endpoint
6. implement first-time setup flow
7. implement login flow
8. protect private routes
9. add dashboard and settings placeholders

---

## 12. Definition of done for phase 1

Phase 1 is complete when:
- the app runs locally
- PostgreSQL connects successfully
- migrations create the three core tables
- first install shows the setup page
- setup creates organization, admin user and settings
- setup is no longer publicly available afterward
- login works with the created admin account
- the protected shell opens after login
- dashboard and settings render as placeholders inside the shell

That is the full target for this phase.
