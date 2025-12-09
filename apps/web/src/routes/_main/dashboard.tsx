import { createFileRoute } from "@tanstack/react-router";
import { BarTriggerView } from "../../components/BarTrigger";

export const Route = createFileRoute("/_main/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  return (
    <>
      <div className="flex flex-col gap-2 h-screen">
        <p>Welcome to your dashboard.</p>
      </div>
      <BarTriggerView className="h-60 border w-full">
        scroll to hide the bar
      </BarTriggerView>
    </>
  );
}
