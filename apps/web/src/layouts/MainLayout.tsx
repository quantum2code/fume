import { Link, Outlet } from "@tanstack/react-router";

export function MainLayout() {
  return (
    <div className="flex flex-col  h-screen w-full">
          <div className="font-bold mb-4">Fume App</div>
          <Link to="/dashboard" activeProps={{ className: "font-bold" }}>
            Dashboard
          </Link>
          <Link to="/shop" activeProps={{ className: "font-bold" }}>
            Shop
          </Link>
          <Link to="/apps" activeProps={{ className: "font-bold" }}>
            Apps
          </Link>
          <Link to="/library" activeProps={{ className: "font-bold" }}>
            Library
          </Link>
          <div className="mt-auto">
             <Link to="/settings" activeProps={{ className: "font-bold" }}>
              Settings
            </Link>
          </div>
      <main className="flex-1 p-4 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
