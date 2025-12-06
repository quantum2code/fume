import { useEffect, useRef, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AppIcon, type AppIconProps } from "./AppIcon";
import { useApp } from "../../context/useApp";

const SystemAppRegistry: AppIconProps[] = [
  { name: "Dashboard", path: "/dashboard", appId: "dashboard" },
  { name: "Shop", path: "/shop", appId: "shop" },
  { name: "Library", path: "/library", appId: "library" },
];

const UserAppRegistry: AppIconProps[] = [
  {
    name: "Spider-Man: Miles Morales",
    appId: "1817190",
    path: "/apps/1817190",
  },
  { name: "The Witcher 3: Wild Hunt", appId: "292030", path: "/apps/292030" },
  { name: "Red Dead Redemption 2", appId: "1174180", path: "/apps/1174180" },
  { name: "Batman: Arkham Knight", appId: "208650", path: "/apps/208650" },
  { name: "Hades", appId: "1145360", path: "/apps/1145360" },
  { name: "Marvel Rivals", appId: "2767030", path: "/apps/2767030" },
  { name: "Stardew Valley", appId: "413150", path: "/apps/413150" },
];
const AppRegistry = [...SystemAppRegistry, ...UserAppRegistry];

export function AppBar() {
  const navigate = useNavigate();
  const { activeApp } = useApp();
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Derive current index from activeApp
  const currentIndex = useMemo(() => {
    const index = AppRegistry.findIndex((app) => app.appId === activeApp);
    return index !== -1 ? index : 0;
  }, [activeApp]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if focus is on an interactive element
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIndex =
          currentIndex < AppRegistry.length - 1
            ? currentIndex + 1
            : currentIndex;
        const nextApp = AppRegistry[nextIndex];
        if (nextApp) {
          navigate({ to: nextApp.path });
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex;
        const prevApp = AppRegistry[prevIndex];
        if (prevApp) {
          navigate({ to: prevApp.path });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, navigate]);

  // Scroll active item into view
  useEffect(() => {
    if (itemRefs.current[currentIndex]) {
      itemRefs.current[currentIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentIndex]);

  return (
    <div className="flex flex-col gap-2 py-8 max-h-full overflow-y-scroll hide-scrollbar">
      {AppRegistry.map((app, index) => {
        return (
          <div
            key={app.appId}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
          >
            <AppIcon
              name={app.name}
              path={app.path}
              appId={app.appId}
              focused={currentIndex === index}
            />
          </div>
        );
      })}
    </div>
  );
}
