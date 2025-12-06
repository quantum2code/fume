import { createFileRoute } from "@tanstack/react-router";
import { BarTriggerView } from "../../components/BarTrigger";

export const Route = createFileRoute("/_main/library")({
  component: Library,
});

function Library() {
  return (
    <div className="p-2">
      <div className="flex flex-col gap-2 h-screen">
        <p>Welcome to your library.</p>
      </div>
      <BarTriggerView className="h-60 border w-full">
        scroll to hide the bar
      </BarTriggerView>
    </div>
  );
}
