import { Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { AppBar } from "../components/AppBar/AppBar";
import { useApp } from "../context/useApp";
import { motion } from "motion/react";

export function MainLayout() {
  const { barHidden, activeApp: appId } = useApp();
  const [isHovered, setIsHovered] = useState(false);

  const showBar = !barHidden || isHovered;

  return (
    <div className="h-screen overflow-y-hidden w-full">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`fixed w-32 h-full top-0 left-0 transition-transform duration-300 z-50 ${showBar ? "translate-x-0" : "-translate-x-full"}`}
      >
        <AppBar />
      </div>
      {/* Trigger Zone */}
      {barHidden && (
        <div
          className="fixed top-0 left-0 w-4 h-full z-40"
          onMouseEnter={() => setIsHovered(true)}
        />
      )}
      <div className="flex w-full h-full">
        <aside
          className={`transition-all duration-300 ${barHidden ? "w-0" : "w-32"}`}
        ></aside>
        <main className="flex-1 w-full overflow-y-auto will-change-transform">
          <div className="p-4 w-full sticky top-0 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {barHidden && appId && (
                <motion.div
                  initial={{ scale: 0.01 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    mass: 0.3,
                    delay: 0.3,
                  }}
                >
                  <img
                    src={`https://steamcdn-a.akamaihd.net/steam/apps/${appId}/header.jpg`}
                    alt=""
                    className="size-12 rounded-xl object-cover object-center"
                  />
                </motion.div>
              )}
              <h3 className="text-xl uppercase">{appId}</h3>
            </div>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
