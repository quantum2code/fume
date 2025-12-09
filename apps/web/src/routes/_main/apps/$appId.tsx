import { createFileRoute } from "@tanstack/react-router";
import { BarTriggerView } from "../../../components/BarTrigger";

export const Route = createFileRoute("/_main/apps/$appId")({
  component: AppDetails,
});

function AppDetails() {
  const { appId } = Route.useParams();
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 h-screen"></div>
      <BarTriggerView className="h-60 border w-full">
        scroll to hide the bar
      </BarTriggerView>
    </div>
  );
}
