import { createFileRoute } from "@tanstack/react-router";
import { BarTriggerView } from "../../components/BarTrigger";

export const Route = createFileRoute("/_main/shop")({
  component: Shop,
});

function Shop() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 h-screen">
        <p>Browse the shop.</p>
      </div>
      <BarTriggerView className="h-60 border w-full">
        scroll to hide the bar
      </BarTriggerView>
    </div>
  );
}
