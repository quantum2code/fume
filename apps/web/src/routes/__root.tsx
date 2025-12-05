import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { AppProvider } from "../context/AppContext";

const RootLayout = () => (
  <AppProvider>
    <Outlet />
    <TanStackRouterDevtools />
  </AppProvider>
);

export const Route = createRootRoute({ component: RootLayout });
