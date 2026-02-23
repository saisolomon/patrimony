"use client";

import { useState } from "react";
import {
  User,
  CreditCard,
  Bell,
  ShieldCheck,
  Mail,
  Phone,
  Clock,
  Fingerprint,
  ExternalLink,
} from "lucide-react";

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
        enabled ? "bg-gold" : "bg-border"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [emailDigest, setEmailDigest] = useState(true);
  const [aiAlerts, setAiAlerts] = useState(true);
  const [taxAlerts, setTaxAlerts] = useState(true);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
          Settings
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          Manage your account preferences
        </p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Profile Section */}
        <div className="rounded-2xl border border-border bg-bg-card p-6">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/15">
              <User className="h-4 w-4 text-gold" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-text-primary">
                Profile
              </h2>
              <p className="text-xs text-text-muted">
                Your personal information
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-text-muted">
                  Full Name
                </label>
                <div className="rounded-xl border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary">
                  Alexander Solomon
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-text-muted">
                  Email Address
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary">
                  <Mail className="h-3.5 w-3.5 text-text-muted" />
                  alexander@solomonfamilyoffice.com
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-text-muted">
                  Phone
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary">
                  <Phone className="h-3.5 w-3.5 text-text-muted" />
                  +1 (212) 555-0199
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-text-muted">
                  Family Office
                </label>
                <div className="rounded-xl border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary">
                  Solomon Family Office
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Section */}
        <div className="rounded-2xl border border-border bg-bg-card p-6">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/15">
              <CreditCard className="h-4 w-4 text-gold" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-text-primary">
                Subscription
              </h2>
              <p className="text-xs text-text-muted">
                Your current plan and billing
              </p>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-text-primary">
                    Dynasty Plan
                  </span>
                  <span className="inline-flex rounded-md bg-gold/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold">
                    Active
                  </span>
                </div>
                <p className="text-sm text-text-muted">
                  $1,997/month &middot; Billed annually
                </p>
                <p className="text-xs text-text-muted">
                  Includes unlimited entities, AI insights, tax optimization,
                  and dedicated support
                </p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-card-hover hover:text-text-primary">
                Manage Billing
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="rounded-2xl border border-border bg-bg-card p-6">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/15">
              <Bell className="h-4 w-4 text-gold" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-text-primary">
                Notifications
              </h2>
              <p className="text-xs text-text-muted">
                Control what alerts you receive
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Weekly Email Digest
                </p>
                <p className="mt-0.5 text-xs text-text-muted">
                  Portfolio summary and performance report every Monday
                </p>
              </div>
              <Toggle enabled={emailDigest} onChange={setEmailDigest} />
            </div>

            <div className="border-t border-border" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-primary">
                  AI Insight Alerts
                </p>
                <p className="mt-0.5 text-xs text-text-muted">
                  Instant notifications for new high-priority insights
                </p>
              </div>
              <Toggle enabled={aiAlerts} onChange={setAiAlerts} />
            </div>

            <div className="border-t border-border" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Tax Event Alerts
                </p>
                <p className="mt-0.5 text-xs text-text-muted">
                  Notifications for tax-loss harvesting opportunities and
                  deadlines
                </p>
              </div>
              <Toggle enabled={taxAlerts} onChange={setTaxAlerts} />
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="rounded-2xl border border-border bg-bg-card p-6">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold/15">
              <ShieldCheck className="h-4 w-4 text-gold" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-text-primary">
                Security
              </h2>
              <p className="text-xs text-text-muted">
                Account security settings
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/15">
                  <Fingerprint className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    Multi-Factor Authentication
                  </p>
                  <p className="mt-0.5 text-xs text-text-muted">
                    TOTP authenticator app configured
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center rounded-md bg-success/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-success">
                Enabled
              </span>
            </div>

            <div className="border-t border-border" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-bg-card-hover">
                  <Clock className="h-4 w-4 text-text-muted" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    Last Login
                  </p>
                  <p className="mt-0.5 text-xs text-text-muted">
                    Today at{" "}
                    {new Date().toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })}{" "}
                    &middot; New York, NY
                  </p>
                </div>
              </div>
              <span className="text-xs text-text-muted">
                192.168.1.xxx
              </span>
            </div>

            <div className="border-t border-border" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-bg-card-hover">
                  <ShieldCheck className="h-4 w-4 text-text-muted" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    Session Timeout
                  </p>
                  <p className="mt-0.5 text-xs text-text-muted">
                    Automatic logout after 30 minutes of inactivity
                  </p>
                </div>
              </div>
              <span className="text-xs text-text-muted">30 min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
