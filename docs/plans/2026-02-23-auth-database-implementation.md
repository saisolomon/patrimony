# Auth + Database Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Clerk authentication and Vercel Postgres database so Patrimony can accept real signups, track subscriptions, and serve per-user data.

**Architecture:** Clerk handles auth UI and session management. Clerk middleware protects dashboard routes. Vercel Postgres stores user profiles, subscriptions, assets, entities, and insights via Prisma ORM. Stripe webhooks write to the database. Onboarding saves preferences and seeds mock data per user.

**Tech Stack:** Clerk (`@clerk/nextjs`), Prisma (`prisma`, `@prisma/client`), `@vercel/postgres` (connection string), Next.js App Router middleware.

---

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install Clerk, Prisma, and Vercel Postgres adapter**

Run:
```bash
npm install @clerk/nextjs prisma @prisma/client
```

**Step 2: Verify install succeeded**

Run: `npm ls @clerk/nextjs prisma @prisma/client`
Expected: All three packages listed without errors.

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add Clerk, Prisma dependencies"
```

---

### Task 2: Set Up Prisma Schema

**Files:**
- Create: `prisma/schema.prisma`

**Step 1: Initialize Prisma**

Run:
```bash
npx prisma init --datasource-provider postgresql
```

This creates `prisma/schema.prisma` and adds `DATABASE_URL` to `.env` (we'll use `POSTGRES_PRISMA_URL` instead).

**Step 2: Write the full schema**

Replace `prisma/schema.prisma` with:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("POSTGRES_PRISMA_URL")
  directUrl = env("POSTGRES_URL_NON_POOLING")
}

model User {
  id               String    @id @default(uuid())
  clerkUserId      String    @unique @map("clerk_user_id")
  email            String
  name             String?
  stripeCustomerId String?   @unique @map("stripe_customer_id")
  onboardingGoal   String?   @map("onboarding_goal")
  netWorthRange    String?   @map("net_worth_range")
  institutionCount String?   @map("institution_count")
  entityCount      String?   @map("entity_count")
  primaryConcern   String?   @map("primary_concern")
  createdAt        DateTime  @default(now()) @map("created_at")
  updatedAt        DateTime  @updatedAt @map("updated_at")

  subscription Subscription?
  entities     Entity[]
  assets       Asset[]
  insights     Insight[]

  @@map("users")
}

model Subscription {
  id                   String    @id @default(uuid())
  userId               String    @unique @map("user_id")
  stripeSubscriptionId String    @unique @map("stripe_subscription_id")
  plan                 String
  billingInterval      String    @map("billing_interval")
  status               String
  trialEnd             DateTime? @map("trial_end")
  currentPeriodEnd     DateTime? @map("current_period_end")
  createdAt            DateTime  @default(now()) @map("created_at")
  updatedAt            DateTime  @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("subscriptions")
}

model Entity {
  id           String   @id @default(uuid())
  userId       String   @map("user_id")
  parentId     String?  @map("parent_id")
  name         String
  type         String
  jurisdiction String?
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  user     User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  parent   Entity?  @relation("EntityHierarchy", fields: [parentId], references: [id])
  children Entity[] @relation("EntityHierarchy")
  assets   Asset[]

  @@map("entities")
}

model Asset {
  id          String   @id @default(uuid())
  userId      String   @map("user_id")
  entityId    String?  @map("entity_id")
  name        String
  category    String
  value       BigInt
  currency    String   @default("USD")
  change24h   Decimal? @map("change_24h")
  change30d   Decimal? @map("change_30d")
  institution String?
  accountMask String?  @map("account_mask")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  entity Entity? @relation(fields: [entityId], references: [id])

  @@map("assets")
}

model Insight {
  id          String   @id @default(uuid())
  userId      String   @map("user_id")
  title       String
  description String
  category    String
  priority    String
  isRead      Boolean  @default(false) @map("is_read")
  createdAt   DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("insights")
}
```

**Step 3: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat: add Prisma schema with all 5 tables"
```

---

### Task 3: Create Prisma Client Singleton

**Files:**
- Create: `src/lib/prisma.ts`

**Step 1: Create the Prisma client singleton**

Write `src/lib/prisma.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

**Step 2: Commit**

```bash
git add src/lib/prisma.ts
git commit -m "feat: add Prisma client singleton"
```

---

### Task 4: Set Up Clerk Middleware

**Files:**
- Create: `src/middleware.ts`

**Step 1: Create the Clerk middleware**

Write `src/middleware.ts`:

```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/pricing",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks/(.*)",
  "/checkout/success",
  "/checkout/canceled",
]);

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

**Step 2: Commit**

```bash
git add src/middleware.ts
git commit -m "feat: add Clerk middleware with route protection"
```

---

### Task 5: Wrap Root Layout with ClerkProvider

**Files:**
- Modify: `src/app/layout.tsx`

**Step 1: Add ClerkProvider to root layout**

Modify `src/app/layout.tsx` to:

```typescript
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Patrimony — Your Legacy, In Real Time",
  description:
    "The unified wealth command center for ultra-high-net-worth individuals. See your entire empire — every entity, every asset, every dollar — in one place.",
  keywords: ["wealth management", "net worth tracking", "UHNW", "family office", "asset management"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-bg-primary text-text-primary`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
```

**Step 2: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: wrap root layout with ClerkProvider"
```

---

### Task 6: Create Sign-In and Sign-Up Pages

**Files:**
- Create: `src/app/sign-in/[[...sign-in]]/page.tsx`
- Create: `src/app/sign-up/[[...sign-up]]/page.tsx`

**Step 1: Create the sign-in page**

Write `src/app/sign-in/[[...sign-in]]/page.tsx`:

```typescript
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-bg-card border border-border shadow-2xl",
          },
        }}
      />
    </div>
  );
}
```

**Step 2: Create the sign-up page**

Write `src/app/sign-up/[[...sign-up]]/page.tsx`:

```typescript
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-bg-card border border-border shadow-2xl",
          },
        }}
      />
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add src/app/sign-in src/app/sign-up
git commit -m "feat: add Clerk sign-in and sign-up pages"
```

---

### Task 7: Update Landing Page CTAs

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Update all CTA links from `/onboarding` to `/sign-up`**

In `src/app/page.tsx`, replace all instances of `href="/onboarding"` with `href="/sign-up"`.

There are 7 instances on lines 50, 90, 359, 418, 462, 503, 573.

Also update the pricing page CTA at `src/app/pricing/page.tsx` line 557: change `href="/onboarding"` to `href="/sign-up"`.

**Step 2: Add a "Sign In" link to the landing page nav**

In `src/app/page.tsx`, find the nav bar area and add a "Sign In" link next to the CTA button:

```tsx
<Link href="/sign-in" className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
  Sign In
</Link>
```

**Step 3: Commit**

```bash
git add src/app/page.tsx src/app/pricing/page.tsx
git commit -m "feat: update CTAs to point to Clerk sign-up"
```

---

### Task 8: Create User Sync Helper

**Files:**
- Create: `src/lib/user-sync.ts`

**Step 1: Create a helper to sync Clerk users to the database**

This function is called on first authenticated visit. It creates a DB user if one doesn't exist yet (upsert pattern).

Write `src/lib/user-sync.ts`:

```typescript
import { prisma } from "./prisma";

export async function syncUserToDb(clerkUserId: string, email: string, name?: string | null) {
  return prisma.user.upsert({
    where: { clerkUserId },
    update: { email, name: name ?? undefined },
    create: {
      clerkUserId,
      email,
      name: name ?? undefined,
    },
  });
}
```

**Step 2: Commit**

```bash
git add src/lib/user-sync.ts
git commit -m "feat: add user sync helper for Clerk-to-DB upsert"
```

---

### Task 9: Create Seed Data Function

**Files:**
- Create: `src/lib/seed-user-data.ts`

**Step 1: Create a function that seeds mock assets, entities, and insights for a new user**

This converts the existing `MOCK_ASSETS`, `MOCK_ENTITIES`, and `MOCK_INSIGHTS` from `mock-data.ts` into database records tied to a user. Called after onboarding completes.

Write `src/lib/seed-user-data.ts`:

```typescript
import { prisma } from "./prisma";
import { MOCK_ASSETS, MOCK_ENTITIES, MOCK_INSIGHTS } from "./mock-data";

export async function seedUserData(userId: string) {
  // Check if user already has data
  const existingAssets = await prisma.asset.count({ where: { userId } });
  if (existingAssets > 0) return;

  // Create entities first (need their IDs for assets)
  const entityIdMap = new Map<string, string>();

  // First pass: create entities without parents
  for (const entity of MOCK_ENTITIES) {
    const created = await prisma.entity.create({
      data: {
        userId,
        name: entity.name,
        type: entity.type,
        jurisdiction: entity.jurisdiction,
      },
    });
    entityIdMap.set(entity.id, created.id);
  }

  // Second pass: set parent relationships
  for (const entity of MOCK_ENTITIES) {
    if (entity.parent) {
      const dbId = entityIdMap.get(entity.id);
      const parentDbId = entityIdMap.get(entity.parent);
      if (dbId && parentDbId) {
        await prisma.entity.update({
          where: { id: dbId },
          data: { parentId: parentDbId },
        });
      }
    }
  }

  // Build a lookup from mock entity name to DB entity ID
  const entityNameToId = new Map<string, string>();
  for (const entity of MOCK_ENTITIES) {
    const dbId = entityIdMap.get(entity.id);
    if (dbId) entityNameToId.set(entity.name, dbId);
  }

  // Create assets
  for (const asset of MOCK_ASSETS) {
    const entityId = asset.entity ? entityNameToId.get(asset.entity) ?? findEntityByPartialName(entityNameToId, asset.entity) : undefined;
    await prisma.asset.create({
      data: {
        userId,
        entityId: entityId ?? undefined,
        name: asset.name,
        category: asset.category,
        value: BigInt(Math.round(asset.value * 100)), // convert dollars to cents
        currency: "USD",
        change24h: asset.change24h,
        change30d: asset.change30d,
      },
    });
  }

  // Create insights
  for (const insight of MOCK_INSIGHTS) {
    await prisma.insight.create({
      data: {
        userId,
        title: insight.title,
        description: insight.summary,
        category: insight.category,
        priority: insight.priority,
      },
    });
  }
}

function findEntityByPartialName(map: Map<string, string>, name: string): string | undefined {
  for (const [key, value] of map) {
    if (key.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }
  return undefined;
}
```

**Step 2: Commit**

```bash
git add src/lib/seed-user-data.ts
git commit -m "feat: add seed function to populate new user with mock data"
```

---

### Task 10: Update Onboarding to Save to Database

**Files:**
- Modify: `src/app/onboarding/page.tsx`
- Create: `src/app/api/onboarding/route.ts`

**Step 1: Create the onboarding API route**

Write `src/app/api/onboarding/route.ts`:

```typescript
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncUserToDb } from "@/lib/user-sync";
import { seedUserData } from "@/lib/seed-user-data";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { goal, netWorthRange, institutionCount, entityCount, primaryConcern } = body;

  // Ensure user exists in DB
  const user = await syncUserToDb(userId, body.email ?? "", body.name);

  // Save onboarding data
  await prisma.user.update({
    where: { clerkUserId: userId },
    data: {
      onboardingGoal: goal,
      netWorthRange: netWorthRange,
      institutionCount: institutionCount,
      entityCount: entityCount,
      primaryConcern: primaryConcern,
    },
  });

  // Seed mock data for the user
  await seedUserData(user.id);

  return NextResponse.json({ success: true });
}
```

**Step 2: Update the onboarding page to call the API**

In `src/app/onboarding/page.tsx`, modify the step 3 "Enter Your Dashboard" button to:
1. Call `/api/onboarding` with the collected data before navigating
2. Change the final link destination from `/dashboard` to `/pricing` (user must pick a plan first)

Add to the component:

```typescript
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
```

Replace the existing `handleContinue` and step 3 link with logic that:
- On step 3 completion, POSTs to `/api/onboarding`
- Then redirects to `/pricing`

The "Enter Your Dashboard" Link on step 3 (line ~454) should become a button that calls the API then navigates:

```tsx
const router = useRouter();
const { user } = useUser();
const [saving, setSaving] = useState(false);

async function handleFinishOnboarding() {
  setSaving(true);
  try {
    await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        goal: selectedGoal,
        netWorthRange: netWorth,
        institutionCount: institutions,
        entityCount: entities,
        primaryConcern: concern,
        email: user?.primaryEmailAddress?.emailAddress,
        name: user?.fullName,
      }),
    });
    router.push("/pricing");
  } catch {
    setSaving(false);
  }
}
```

Replace the `<Link href="/dashboard">Enter Your Dashboard</Link>` with:

```tsx
<button
  onClick={handleFinishOnboarding}
  disabled={saving}
  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-gold to-gold-dark text-bg-primary hover:shadow-lg hover:shadow-gold/20 hover:scale-[1.02] transition-all duration-200"
>
  {saving ? "Setting up..." : "Choose Your Plan"}
  <ArrowRight className="w-4 h-4" />
</button>
```

**Step 3: Commit**

```bash
git add src/app/api/onboarding/route.ts src/app/onboarding/page.tsx
git commit -m "feat: onboarding saves to DB and seeds mock data"
```

---

### Task 11: Update Stripe Checkout to Include Clerk User ID

**Files:**
- Modify: `src/app/api/checkout/route.ts`

**Step 1: Pass clerk_user_id in Stripe checkout metadata**

Modify `src/app/api/checkout/route.ts`:

Add at top:
```typescript
import { auth } from "@clerk/nextjs/server";
```

Inside the POST handler, after the planId/billingInterval destructuring, add:

```typescript
const { userId } = await auth();
if (!userId) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

In the `stripe.checkout.sessions.create` call, add `metadata` at the session level (not just subscription_data):

```typescript
metadata: {
  clerkUserId: userId,
},
subscription_data: {
  trial_period_days: plan.trialDays,
  metadata: {
    planId,
    billingInterval,
    clerkUserId: userId,
  },
},
```

**Step 2: Commit**

```bash
git add src/app/api/checkout/route.ts
git commit -m "feat: pass Clerk user ID in Stripe checkout metadata"
```

---

### Task 12: Update Stripe Webhook to Write to Database

**Files:**
- Modify: `src/app/api/webhooks/stripe/route.ts`

**Step 1: Replace all TODO comments with real database operations**

Rewrite `src/app/api/webhooks/stripe/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const clerkUserId = session.metadata?.clerkUserId;
        if (!clerkUserId) {
          console.error("No clerkUserId in checkout session metadata");
          break;
        }

        // Link Stripe customer to user
        await prisma.user.update({
          where: { clerkUserId },
          data: { stripeCustomerId: session.customer as string },
        });

        // Fetch subscription details from Stripe
        const subscriptionId = session.subscription as string;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const planId = subscription.metadata?.planId ?? "steward";
        const billingInterval = subscription.metadata?.billingInterval ?? "monthly";

        // Create subscription record
        const user = await prisma.user.findUnique({ where: { clerkUserId } });
        if (user) {
          await prisma.subscription.upsert({
            where: { userId: user.id },
            update: {
              stripeSubscriptionId: subscriptionId,
              plan: planId,
              billingInterval,
              status: subscription.status,
              trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
            create: {
              userId: user.id,
              stripeSubscriptionId: subscriptionId,
              plan: planId,
              billingInterval,
              status: subscription.status,
              trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            status: subscription.status,
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subscription.id },
          data: { status: "canceled" },
        });
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        console.log("Payment succeeded:", invoice.id);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const customerId = invoice.customer as string;
        // Set subscription to past_due
        const user = await prisma.user.findUnique({ where: { stripeCustomerId: customerId } });
        if (user) {
          await prisma.subscription.updateMany({
            where: { userId: user.id },
            data: { status: "past_due" },
          });
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
```

**Step 2: Commit**

```bash
git add src/app/api/webhooks/stripe/route.ts
git commit -m "feat: Stripe webhook writes subscriptions to database"
```

---

### Task 13: Create Data Access Layer for Dashboard

**Files:**
- Create: `src/lib/dal.ts`

**Step 1: Create server-side data access functions**

Write `src/lib/dal.ts`:

```typescript
import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import { syncUserToDb } from "./user-sync";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    include: { subscription: true },
  });

  if (!user) {
    // First visit after sign-up — sync from Clerk
    // The user will be created when they hit onboarding
    redirect("/onboarding");
  }

  return user;
}

export async function requireSubscription() {
  const user = await getCurrentUser();
  if (!user.subscription || !["active", "trialing"].includes(user.subscription.status)) {
    redirect("/pricing");
  }
  return user;
}

export async function getUserAssets(userId: string) {
  return prisma.asset.findMany({
    where: { userId },
    include: { entity: true },
    orderBy: { value: "desc" },
  });
}

export async function getUserEntities(userId: string) {
  return prisma.entity.findMany({
    where: { userId },
    include: { assets: true, children: true },
    orderBy: { name: "asc" },
  });
}

export async function getUserInsights(userId: string) {
  return prisma.insight.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}
```

**Step 2: Commit**

```bash
git add src/lib/dal.ts
git commit -m "feat: add data access layer for dashboard queries"
```

---

### Task 14: Update Dashboard Layout Sidebar with Real User Data

**Files:**
- Modify: `src/app/(dashboard)/layout.tsx`

**Step 1: Replace hardcoded user info with Clerk data**

The current dashboard layout at `src/app/(dashboard)/layout.tsx` is a client component with hardcoded "Alexander S." and "Dynasty Plan".

Strategy: Keep the layout as a client component but use Clerk's `useUser()` hook and `useClerk()` for sign-out. For the plan badge, we'll fetch it client-side from a new API route.

Add imports:
```typescript
import { useUser, useClerk } from "@clerk/nextjs";
```

Replace the hardcoded user area (lines 106-120) with:

```tsx
const { user } = useUser();
const { signOut } = useClerk();

// In the user area JSX:
<div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/20 text-sm font-semibold text-gold">
  {user?.firstName?.[0]}{user?.lastName?.[0] || ""}
</div>
<div className="flex-1 min-w-0">
  <p className="truncate text-sm font-medium text-text-primary">
    {user?.firstName} {user?.lastName?.[0]}.
  </p>
  <p className="truncate text-xs text-gold">Patrimony</p>
</div>
<button
  onClick={() => signOut({ redirectUrl: "/" })}
  className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-bg-card hover:text-danger"
>
  <LogOut className="h-4 w-4" />
</button>
```

**Step 2: Commit**

```bash
git add src/app/(dashboard)/layout.tsx
git commit -m "feat: use Clerk user data in dashboard sidebar"
```

---

### Task 15: Update Dashboard Page to Use Database Data

**Files:**
- Modify: `src/app/(dashboard)/dashboard/page.tsx`

**Step 1: Convert dashboard to server component fetching from DB**

The current dashboard at `src/app/(dashboard)/dashboard/page.tsx` is a client component importing from `mock-data.ts`.

Strategy: Convert to a server component that fetches data via the DAL, then passes data as props to client chart components.

Create a client component for the charts:
- Create: `src/components/dashboard/charts.tsx` — extract the Recharts components (AreaChart, PieChart) into a client component that receives data as props.

The server component page fetches user data, computes totals, and renders the page with real DB data.

Key changes:
- Remove `"use client"` from the page
- Import from `@/lib/dal` instead of `@/lib/mock-data`
- Use `requireSubscription()` to gate access
- Use `getUserAssets()` and `getUserInsights()` for data
- Extract chart components to separate client file
- Convert BigInt values to numbers for display (divide by 100 to get dollars)

**Step 2: Commit**

```bash
git add src/app/(dashboard)/dashboard/page.tsx src/components/dashboard/charts.tsx
git commit -m "feat: dashboard page reads from database"
```

---

### Task 16: Update Assets Page to Use Database Data

**Files:**
- Modify: `src/app/(dashboard)/assets/page.tsx`

**Step 1: Convert assets page to use DB data**

Similar approach to Task 15:
- Make the page a server component that fetches from `getUserAssets()`
- Extract filter/search UI into a client component that receives assets as props
- Convert BigInt values to numbers for display

**Step 2: Commit**

```bash
git add src/app/(dashboard)/assets/page.tsx
git commit -m "feat: assets page reads from database"
```

---

### Task 17: Update Entities Page to Use Database Data

**Files:**
- Modify: `src/app/(dashboard)/entities/page.tsx`

**Step 1: Convert entities page to use DB data**

- Server component fetching from `getUserEntities()`
- Entity tree built from DB records using parentId relationships
- Convert BigInt values from assets

**Step 2: Commit**

```bash
git add src/app/(dashboard)/entities/page.tsx
git commit -m "feat: entities page reads from database"
```

---

### Task 18: Update Insights Page to Use Database Data

**Files:**
- Modify: `src/app/(dashboard)/insights/page.tsx`

**Step 1: Convert insights page to use DB data**

- Server component fetching from `getUserInsights()`
- Filter UI as client component receiving insights as props

**Step 2: Commit**

```bash
git add src/app/(dashboard)/insights/page.tsx
git commit -m "feat: insights page reads from database"
```

---

### Task 19: Update Settings Page with Real User Data

**Files:**
- Modify: `src/app/(dashboard)/settings/page.tsx`

**Step 1: Add real user profile and subscription data**

Strategy: Make a server component wrapper that fetches data, passes to client component for the toggles.

- Profile: use Clerk `currentUser()` server-side
- Subscription: use `getCurrentUser()` from DAL which includes subscription
- "Manage Billing" button: create a Stripe Customer Portal session via `/api/billing-portal` route

**Step 2: Create billing portal API route**

Create `src/app/api/billing-portal/route.ts`:

```typescript
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { clerkUserId: userId } });
  if (!user?.stripeCustomerId) {
    return NextResponse.json({ error: "No billing account" }, { status: 400 });
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
  });

  return NextResponse.json({ url: session.url });
}
```

**Step 3: Commit**

```bash
git add src/app/(dashboard)/settings/page.tsx src/app/api/billing-portal/route.ts
git commit -m "feat: settings page shows real user and subscription data"
```

---

### Task 20: Update Checkout Success Page

**Files:**
- Modify: `src/app/checkout/success/page.tsx`

**Step 1: Update the success page to redirect to dashboard**

Change the CTA from "Start Onboarding" (linking to `/onboarding`) to "Go to Dashboard" (linking to `/dashboard`), since the user already completed onboarding before checkout.

**Step 2: Commit**

```bash
git add src/app/checkout/success/page.tsx
git commit -m "feat: checkout success redirects to dashboard"
```

---

### Task 21: Update Environment Variables

**Files:**
- Modify: `.env.local`

**Step 1: Add Clerk and Postgres placeholders to .env.local**

Add to `.env.local`:

```
# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_PASTE_HERE
CLERK_SECRET_KEY=sk_test_PASTE_HERE
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Vercel Postgres
POSTGRES_PRISMA_URL=postgres://PASTE_HERE
POSTGRES_URL_NON_POOLING=postgres://PASTE_HERE
```

**Step 2: User action required**

The user must:
1. Create a Clerk app at https://dashboard.clerk.com
2. Copy the publishable and secret keys
3. Create a Vercel Postgres database at https://vercel.com/dashboard (Storage → Create → Postgres)
4. Copy the connection strings
5. Paste all values into `.env.local`

**Step 3: Run Prisma migration**

Once the database URL is set:

```bash
npx prisma db push
```

This creates all tables in Vercel Postgres.

**Step 4: Generate Prisma client**

```bash
npx prisma generate
```

**Step 5: Commit**

No commit needed — `.env.local` is gitignored.

---

### Task 22: Add Vercel Environment Variables and Deploy

**Step 1: Add new env vars to Vercel**

```bash
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY production
vercel env add CLERK_SECRET_KEY production
vercel env add NEXT_PUBLIC_CLERK_SIGN_IN_URL production
vercel env add NEXT_PUBLIC_CLERK_SIGN_UP_URL production
vercel env add NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL production
vercel env add POSTGRES_PRISMA_URL production
vercel env add POSTGRES_URL_NON_POOLING production
```

**Step 2: Push and deploy**

```bash
git push origin main
vercel --prod
```

**Step 3: Run Prisma migration against production DB**

```bash
npx prisma db push
```

(Using the production DATABASE_URL — pull with `vercel env pull`)

---

### Task 23: Smoke Test

**Step 1: Test the full flow locally**

1. Run `npm run dev`
2. Visit `http://localhost:3000` — landing page loads
3. Click "Start Free Trial" — redirects to `/sign-up`
4. Create account — redirects to `/onboarding`
5. Complete onboarding — saves to DB, redirects to `/pricing`
6. Pick a plan — Stripe checkout opens
7. Complete payment (use Stripe test card `4242424242424242`) — redirects to `/checkout/success`
8. Click "Go to Dashboard" — dashboard loads with seeded data
9. Check sidebar shows your real name
10. Check Settings shows your real profile and subscription
11. Visit `/dashboard` while logged out — redirects to `/sign-in`

**Step 2: Verify database**

Run `npx prisma studio` and check:
- `users` table has your record with Clerk ID and Stripe customer ID
- `subscriptions` table has your subscription with status "trialing"
- `assets`, `entities`, `insights` tables have seeded data
