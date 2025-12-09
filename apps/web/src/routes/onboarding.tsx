import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingPage,
});

function OnboardingPage() {
  return (
        <div className="space-y-4">
            Welcome to Fume
            <Link to="/dashboard">Skip to Dashboard</Link>
        </div>
  );
}
