import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/library")({
  component: Library,
});

function Library() {
  return (
    <div className="p-2">
      <h3 className="text-xl font-bold">Library</h3>
      <p>Your library content.</p>
    </div>
  );
}
