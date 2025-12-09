import { createFileRoute } from "@tanstack/react-router";
import { SettingsLayout } from "../../layouts/SettingsLayout";

export const Route = createFileRoute("/settings")({
  component: SettingsLayout,
});

