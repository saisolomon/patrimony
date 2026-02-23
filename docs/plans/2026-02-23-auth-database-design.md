# Auth + Database Design — Patrimony

**Date**: 2026-02-23
**Status**: Approved

## Decisions

- **Auth**: Clerk (managed, pre-built UI, MFA, social logins)
- **Database**: Vercel Postgres
- **ORM**: Prisma
- **User flow**: Signup → Onboarding → Checkout → Dashboard

## Database Schema

### users
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| clerk_user_id | TEXT | Unique, not null |
| email | TEXT | Not null |
| name | TEXT | |
| stripe_customer_id | TEXT | Unique, nullable |
| onboarding_goal | TEXT | net-worth/entity/tax/family |
| net_worth_range | TEXT | From onboarding step 2 |
| institution_count | TEXT | From onboarding step 2 |
| entity_count | TEXT | From onboarding step 2 |
| primary_concern | TEXT | From onboarding step 2 |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### subscriptions
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | References users, unique |
| stripe_subscription_id | TEXT | Unique, not null |
| plan | TEXT | steward/principal/dynasty |
| billing_interval | TEXT | monthly/annual |
| status | TEXT | trialing/active/past_due/canceled |
| trial_end | TIMESTAMP | |
| current_period_end | TIMESTAMP | |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### entities
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | References users |
| parent_id | UUID | References entities, nullable (nesting) |
| name | TEXT | Not null |
| type | TEXT | trust/llc/foundation/corporation/personal |
| jurisdiction | TEXT | |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### assets
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | References users |
| entity_id | UUID | References entities, nullable |
| name | TEXT | Not null |
| category | TEXT | equities/fixed-income/real-estate/private-equity/crypto/cash/alternatives/collectibles |
| value | BIGINT | In cents |
| currency | TEXT | Default 'USD' |
| change_24h | DECIMAL | Percentage |
| change_30d | DECIMAL | Percentage |
| institution | TEXT | |
| account_mask | TEXT | Last 4 digits |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### insights
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | References users |
| title | TEXT | Not null |
| description | TEXT | Not null |
| category | TEXT | opportunity/risk/tax/rebalance |
| priority | TEXT | high/medium/low |
| is_read | BOOLEAN | Default false |
| created_at | TIMESTAMP | |

## Auth Flow

### Clerk Integration
- `ClerkProvider` wraps root layout
- Clerk middleware protects all `(dashboard)` routes
- Unauthenticated users redirect to `/sign-in`

### Public Routes
- `/` (landing)
- `/pricing`
- `/sign-in`
- `/sign-up`
- `/api/webhooks/stripe`

### Protected Routes
- `/dashboard`
- `/assets`
- `/entities`
- `/insights`
- `/settings`
- `/onboarding`

### User Journey
1. Landing page → "Start Free Trial" → Clerk sign-up (`/sign-up`)
2. After sign-up → redirect to `/onboarding`
3. Onboarding saves preferences to DB
4. Onboarding complete → redirect to `/pricing`
5. User picks plan → Stripe checkout (with `clerk_user_id` in metadata)
6. Stripe webhook creates subscription record in DB
7. `/checkout/success` → redirect to `/dashboard`
8. Dashboard layout checks subscription status

## Data Flow

### On sign-up (Clerk webhook or first dashboard visit)
- Create `users` row with `clerk_user_id` and `email`

### On onboarding complete
- Update `users` row with onboarding preferences
- Seed mock assets, entities, insights for the user

### On Stripe checkout complete (webhook)
- Update `users.stripe_customer_id`
- Create `subscriptions` row

### On dashboard load
- Middleware checks auth
- Fetch user + subscription from DB
- If no subscription → redirect to `/pricing`
- Dashboard pages query user's assets, entities, insights

## UI Changes

### Sidebar
- Replace hardcoded "Alexander S." with Clerk `useUser()` data
- Logout button uses Clerk `signOut()`
- Show plan badge from subscription data

### Settings Page
- Profile: pull from Clerk user data
- Subscription: pull from DB subscription record
- "Manage Billing": link to Stripe Customer Portal

### Checkout Route
- Pass `clerk_user_id` in Stripe checkout metadata
- Webhook uses this to link subscription to user

## Environment Variables (new)

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
POSTGRES_URL=postgres://...
POSTGRES_PRISMA_URL=postgres://...
POSTGRES_URL_NON_POOLING=postgres://...
```
