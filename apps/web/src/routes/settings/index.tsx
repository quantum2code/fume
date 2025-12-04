import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings/")({
  component: SettingsIndex,
});

function SettingsIndex() {
  return (
    <div className="p-2">
      <h1 className="text-xl font-bold">Settings</h1>
      <p>Manage your settings here.</p>
    </div>
  );
};