import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="p-2">
      <h3 className="text-xl font-bold">Dashboard</h3>
      <p>Welcome to your dashboard.</p>
    </div>
  );
}
