import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings/profile")({
  component: ProfileSettings,
});

function ProfileSettings() {
  return (
    <div className="p-2">
      <h3 className="text-xl font-bold">Profile Settings</h3>
      <p>Manage your profile here.</p>
    </div>
  );
}
