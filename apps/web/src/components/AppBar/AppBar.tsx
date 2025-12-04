import { useApp } from "../../context/AppContext";
import { AppIcon, type AppIconProps } from "./AppIcon";

const SystemAppRegistry: AppIconProps[] = [
    { name: "Dashboard", path: "/dashboard", appId: "dashboard" },
    { name: "Shop", path: "/shop", appId: "shop" },
    { name: "Library", path: "/library", appId: "library" },
];

const UserAppRegistry: AppIconProps[] = [
    { name: "Counter-Strike 2", appId: "730", path: "/apps/730" },
    { name: "Dota 2", appId: "570", path: "/apps/570" },
    { name: "Apex Legends", appId: "1172470", path: "/apps/1172470" },
    { name: "PUBG: BATTLEGROUNDS", appId: "578080", path: "/apps/578080" },
    { name: "Grand Theft Auto V", appId: "271590", path: "/apps/271590" },
    { name: "Cyberpunk 2077", appId: "1091500", path: "/apps/1091500" },
    { name: "Elden Ring", appId: "1245620", path: "/apps/1245620" },
    { name: "Baldur's Gate 3", appId: "1086940", path: "/apps/1086940" }, 
];
const AppRegistry = [...SystemAppRegistry, ...UserAppRegistry];
export function AppBar() {
    const { pinnedApps } = useApp();

    return (
        <div className="flex flex-col gap-2 max-h-full overflow-y-scroll overflow-x-hidden hide-scrollbar">
            {AppRegistry.map((app) => {
                return <AppIcon key={app.appId} name={app.name} path={app.path} appId={app.appId} />;
            })}
        </div>
    )
}