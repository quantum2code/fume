import { Link, Outlet } from "@tanstack/react-router";

export function SettingsLayout() {
  return (
    <div className="flex flex-col h-screen w-full">
        <div className="mb-4">
            <Link to="/dashboard" activeProps={{ className: "font-bold" }}>Back to Dashboard</Link>
        </div>
        <h2 className="font-bold text-xl mb-4">Settings</h2>
          <Link to="/settings" activeProps={{ className: "font-bold" }} activeOptions={{ exact: true }}>
            General
          </Link>
          <Link to="/settings/profile" activeProps={{ className: "font-bold" }}>
            Profile
          </Link>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
