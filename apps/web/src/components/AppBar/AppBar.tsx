import { AppIcon, type AppIconProps } from "./AppIcon";

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
  return (
    <div className="flex flex-col gap-2 max-h-full overflow-y-scroll hide-scrollbar">
      {AppRegistry.map((app) => {
        return (
          <AppIcon
            key={app.appId}
            name={app.name}
            path={app.path}
            appId={app.appId}
          />
        );
      })}
    </div>
  );
}
