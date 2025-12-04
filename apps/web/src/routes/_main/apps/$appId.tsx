import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/apps/$appId")({
  component: AppDetails,
});

function AppDetails() {
  const { appId } = Route.useParams();
  return (
    <div className="p-2">
      <h3 className="text-xl font-bold">App Details: {appId}</h3>
      <p>Details for app with ID: {appId}</p>
    </div>
  );
}
