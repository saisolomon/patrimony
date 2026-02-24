"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Target,
  Building2,
  Calculator,
  Users,
  ChevronRight,
  Check,
  ArrowRight,
  Sparkles,
  Crown,
  TrendingUp,
  BarChart3,
  Lightbulb,
  Shield,
} from "lucide-react";

const goals = [
  {
    id: "net-worth",
    icon: Target,
    title: "Consolidated Net Worth View",
    description: "See everything in one place",
  },
  {
    id: "entity",
    icon: Building2,
    title: "Entity & Trust Management",
    description: "Map my complex structures",
  },
  {
    id: "tax",
    icon: Calculator,
    title: "Tax Optimization",
    description: "Minimize my tax exposure",
  },
  {
    id: "family",
    icon: Users,
    title: "Family Wealth Planning",
    description: "Multi-generational visibility",
  },
];

const netWorthRanges = [
  "$5M - $10M",
  "$10M - $50M",
  "$50M - $100M",
  "$100M - $500M",
  "$500M+",
];

const institutionCounts = ["1 - 5", "6 - 10", "11 - 20", "20+"];

const entityCounts = ["0", "1 - 3", "4 - 10", "10+"];

const primaryConcerns = [
  "Visibility",
  "Tax Efficiency",
  "Estate Planning",
  "Risk Management",
];

const steps = [
  { number: 1, label: "Your Goal" },
  { number: 2, label: "Your Portfolio" },
  { number: 3, label: "Your Dashboard" },
];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                currentStep > step.number
                  ? "bg-gold text-bg-primary"
                  : currentStep === step.number
                  ? "bg-gold/15 text-gold border-2 border-gold"
                  : "bg-bg-card text-text-muted border border-border"
              }`}
            >
              {currentStep > step.number ? (
                <Check className="w-4 h-4" />
              ) : (
                step.number
              )}
            </div>
            <span
              className={`hidden sm:block text-sm font-medium transition-colors ${
                currentStep >= step.number
                  ? "text-text-primary"
                  : "text-text-muted"
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-8 sm:w-12 h-px transition-colors ${
                currentStep > step.number ? "bg-gold" : "bg-border"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function SelectField({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text-secondary">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl bg-bg-card border border-border px-4 py-3 text-sm text-text-primary outline-none transition-colors focus:border-gold focus:ring-1 focus:ring-gold/30 hover:border-border-light cursor-pointer"
        >
          <option value="" className="bg-bg-card text-text-muted">
            Select...
          </option>
          {options.map((option) => (
            <option key={option} value={option} className="bg-bg-card">
              {option}
            </option>
          ))}
        </select>
        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted rotate-90 pointer-events-none" />
      </div>
    </div>
  );
}

function ShimmerEffect() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
      <div className="absolute -inset-[100%] animate-[shimmer_3s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-gold/5 to-transparent" />
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Mini Dashboard Card */}
      <div className="relative rounded-2xl border border-gold/30 bg-bg-card overflow-hidden">
        <ShimmerEffect />
        <div className="relative p-6 sm:p-8">
          {/* Net Worth Header */}
          <div className="mb-6">
            <p className="text-xs uppercase tracking-wider text-text-muted mb-1">
              Total Net Worth
            </p>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-bold text-text-primary">
                $109,750,000
              </span>
              <span className="inline-flex items-center gap-1 text-sm text-success font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                +2.4%
              </span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
            <div className="rounded-xl bg-bg-primary/60 border border-border/50 p-3 sm:p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <BarChart3 className="w-3.5 h-3.5 text-gold" />
                <span className="text-lg sm:text-xl font-bold text-text-primary">
                  23
                </span>
              </div>
              <p className="text-xs text-text-muted">Assets</p>
            </div>
            <div className="rounded-xl bg-bg-primary/60 border border-border/50 p-3 sm:p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Building2 className="w-3.5 h-3.5 text-gold" />
                <span className="text-lg sm:text-xl font-bold text-text-primary">
                  9
                </span>
              </div>
              <p className="text-xs text-text-muted">Entities</p>
            </div>
            <div className="rounded-xl bg-bg-primary/60 border border-border/50 p-3 sm:p-4 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Lightbulb className="w-3.5 h-3.5 text-gold" />
                <span className="text-lg sm:text-xl font-bold text-text-primary">
                  6
                </span>
              </div>
              <p className="text-xs text-text-muted">AI Insights</p>
            </div>
          </div>

          {/* Ready Card */}
          <div className="rounded-xl bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/20 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold/15 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-gold" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">
                Your personalized dashboard is ready
              </p>
              <p className="text-xs text-text-secondary mt-0.5">
                AI insights tailored to your portfolio are being generated
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [netWorth, setNetWorth] = useState("");
  const [institutions, setInstitutions] = useState("");
  const [entities, setEntities] = useState("");
  const [concern, setConcern] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleFinishOnboarding() {
    setSaving(true);
    try {
      const res = await fetch("/api/onboarding", {
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
      if (!res.ok) {
        throw new Error("Failed to save onboarding data");
      }
      router.push("/pricing");
    } catch {
      setSaving(false);
    }
  }

  const canProceedStep1 = selectedGoal !== null;
  const canProceedStep2 =
    netWorth !== "" &&
    institutions !== "" &&
    entities !== "" &&
    concern !== "";

  const handleContinue = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      {/* Top Bar */}
      <nav className="border-b border-border bg-bg-primary/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center">
                <Crown className="w-4 h-4 text-bg-primary" />
              </div>
              <span className="text-lg font-semibold text-text-primary tracking-tight">
                Patrimony
              </span>
            </Link>
            <span className="text-xs text-text-muted">
              Step {currentStep} of 3
            </span>
          </div>
        </div>
      </nav>

      {/* Progress Indicator */}
      <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 border-b border-border/50">
        <StepIndicator currentStep={currentStep} />
      </div>

      {/* Step Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Step 1 */}
        {currentStep === 1 && (
          <div className="w-full max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
                Welcome to Patrimony
              </h1>
              <p className="text-text-secondary text-base sm:text-lg">
                Let&apos;s personalize your experience. What&apos;s your primary goal?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {goals.map((goal) => {
                const Icon = goal.icon;
                const isSelected = selectedGoal === goal.id;
                return (
                  <button
                    key={goal.id}
                    onClick={() => setSelectedGoal(goal.id)}
                    className={`relative group rounded-xl p-5 text-left transition-all duration-200 border ${
                      isSelected
                        ? "border-gold bg-gold/5 ring-1 ring-gold/30"
                        : "border-border bg-bg-card hover:border-border-light hover:bg-bg-card-hover"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3">
                        <div className="w-5 h-5 rounded-full bg-gold flex items-center justify-center">
                          <Check className="w-3 h-3 text-bg-primary" />
                        </div>
                      </div>
                    )}
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                        isSelected
                          ? "bg-gold/15"
                          : "bg-bg-card-hover group-hover:bg-border/30"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          isSelected ? "text-gold" : "text-text-secondary"
                        }`}
                      />
                    </div>
                    <h3
                      className={`text-sm font-semibold mb-1 ${
                        isSelected ? "text-text-primary" : "text-text-primary"
                      }`}
                    >
                      {goal.title}
                    </h3>
                    <p className="text-xs text-text-muted">
                      {goal.description}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleContinue}
                disabled={!canProceedStep1}
                className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  canProceedStep1
                    ? "bg-gradient-to-r from-gold to-gold-dark text-bg-primary hover:shadow-lg hover:shadow-gold/20 hover:scale-[1.02] cursor-pointer"
                    : "bg-bg-card text-text-muted border border-border cursor-not-allowed"
                }`}
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {currentStep === 2 && (
          <div className="w-full max-w-lg mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
                Help Us Set Up Your Dashboard
              </h1>
              <p className="text-text-secondary text-base sm:text-lg">
                Tell us about your portfolio so we can tailor your experience
              </p>
            </div>

            <div className="space-y-5 mb-10">
              <SelectField
                label="Estimated net worth range"
                options={netWorthRanges}
                value={netWorth}
                onChange={setNetWorth}
              />
              <SelectField
                label="Number of financial institutions"
                options={institutionCounts}
                value={institutions}
                onChange={setInstitutions}
              />
              <SelectField
                label="Number of entities (trusts, LLCs, etc.)"
                options={entityCounts}
                value={entities}
                onChange={setEntities}
              />
              <SelectField
                label="Primary concern"
                options={primaryConcerns}
                value={concern}
                onChange={setConcern}
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleContinue}
                disabled={!canProceedStep2}
                className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  canProceedStep2
                    ? "bg-gradient-to-r from-gold to-gold-dark text-bg-primary hover:shadow-lg hover:shadow-gold/20 hover:scale-[1.02] cursor-pointer"
                    : "bg-bg-card text-text-muted border border-border cursor-not-allowed"
                }`}
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {currentStep === 3 && (
          <div className="w-full max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 mb-5">
                <Sparkles className="w-4 h-4 text-gold" />
                <span className="text-sm text-gold font-medium">
                  Setup Complete
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
                Welcome to Your Wealth Command Center
              </h1>
              <p className="text-text-secondary text-base sm:text-lg">
                Your personalized dashboard has been configured. After subscribing, you can connect your financial accounts for real-time data.
              </p>
            </div>

            <div className="mb-10">
              <DashboardPreview />
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleFinishOnboarding}
                disabled={saving}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-gold to-gold-dark text-bg-primary hover:shadow-lg hover:shadow-gold/20 hover:scale-[1.02] transition-all duration-200"
              >
                {saving ? "Setting up..." : "Choose Your Plan"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Security Footer */}
      <footer className="border-t border-border/50 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-2">
          <Shield className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-xs text-text-muted">
            Bank-level encryption protects your data at every step
          </span>
        </div>
      </footer>

      {/* Shimmer animation keyframes */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
