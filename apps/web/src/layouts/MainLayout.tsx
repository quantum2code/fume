import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { AppBar } from "../components/AppBar/AppBar";
import { useApp } from "../context/AppContext";
import { useEffect } from "react";

export function MainLayout() {
  const { setActiveApp } = useApp();
  const location = useLocation();

  useEffect(() => {

    if (location.pathname.includes("dashboard")) setActiveApp("dashboard");
    else if (location.pathname.includes("shop")) setActiveApp("shop");
    else if (location.pathname.includes("library")) setActiveApp("library");
    else if (location.pathname.includes("settings")) setActiveApp("settings");
    else if (location.pathname.match(/^\/apps\/\d+$/)) {
      setActiveApp(location.pathname.split("/")[2]);
    }
    else setActiveApp("dashboard");
  }, [location.pathname, setActiveApp]);

  return (
    <div className="flex h-screen overflow-y-hidden w-full p-8">
      <aside className="w-32">
        <AppBar/>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
