import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/apps/")({
  component: AppsIndex,
});

function AppsIndex() {
  return (
    <div className="p-2">
      <h3 className="text-xl font-bold mb-4">Apps</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((id) => (
              <Link key={id} to="/apps/$appId" params={{ appId: id.toString() }} className="block p-4 border rounded">
                  <div className="font-bold">App {id}</div>
                  <div className="text-sm text-gray-500">Click to view details</div>
              </Link>
          ))}
      </div>
    </div>
  );
}
