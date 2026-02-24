"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Link2, Loader2 } from "lucide-react";

declare global {
  interface Window {
    Plaid?: {
      create: (config: PlaidCreateConfig) => PlaidHandler;
    };
  }
}

interface PlaidCreateConfig {
  token: string;
  onSuccess: (publicToken: string, metadata: PlaidSuccessMetadata) => void;
  onExit: (err: PlaidError | null) => void;
  onEvent: (eventName: string) => void;
}

interface PlaidHandler {
  open: () => void;
  destroy: () => void;
}

interface PlaidSuccessMetadata {
  institution?: {
    institution_id: string;
    name: string;
  };
}

interface PlaidError {
  error_code: string;
  error_message: string;
}

export function PlaidLinkButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Load Plaid Link script
  useEffect(() => {
    if (document.getElementById("plaid-link-script")) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "plaid-link-script";
    script.src = "https://cdn.plaid.com/link/v2/stable/link-initialize.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.head.appendChild(script);
  }, []);

  const handleConnect = useCallback(async () => {
    if (!scriptLoaded || !window.Plaid) return;

    setLoading(true);

    try {
      // Get link token from our API
      const res = await fetch("/api/plaid/link-token", { method: "POST" });
      const { linkToken } = await res.json();

      if (!linkToken) {
        throw new Error("Failed to get link token");
      }

      // Open Plaid Link
      const handler = window.Plaid.create({
        token: linkToken,
        onSuccess: async (publicToken: string, metadata: PlaidSuccessMetadata) => {
          try {
            await fetch("/api/plaid/exchange-token", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                publicToken,
                institutionId: metadata.institution?.institution_id,
                institutionName: metadata.institution?.name,
              }),
            });
            router.refresh();
          } catch (error) {
            console.error("Exchange token error:", error);
          } finally {
            setLoading(false);
          }
        },
        onExit: () => {
          setLoading(false);
        },
        onEvent: () => {},
      });

      handler.open();
    } catch (error) {
      console.error("Plaid Link error:", error);
      setLoading(false);
    }
  }, [scriptLoaded, router]);

  return (
    <button
      onClick={handleConnect}
      disabled={loading || !scriptLoaded}
      className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-card-hover hover:text-text-primary disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Link2 className="h-4 w-4" />
      )}
      Connect Account
    </button>
  );
}
