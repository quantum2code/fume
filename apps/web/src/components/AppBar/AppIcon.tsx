import { Link } from "@tanstack/react-router";
import { useApp } from "../../context/AppContext";
import NoiseBox from "../NoiseBox";

export interface AppIconProps {
  name: string;
  path: string;
  appId?: string;
}

export function AppIcon({ name, path, appId }: AppIconProps) {
  const { activeApp } = useApp();
  const isActive = activeApp === appId;

  return (
    <div
      className={`will-change-transform origin-left transition-all duration-300 ${isActive ? "scale-150 my-5" : ""}`}
    >
      <Link to={path}>
        <div className="relative p-[4px] size-20">
          {isActive && (
            <div
              className={`absolute w-full h-full inset-0 transition-[opacity_scale] noise-mask rounded-xl scale-100`}
            >
              <div className="absolute -inset-[2px] opacity-70">
                <NoiseBox />
              </div>
            </div>
          )}
          <div className="relative w-full h-full z-10 text-white bg-neutral-900 rounded-lg overflow-hidden shadow-lg">
            {isActive && (
              <div className="absolute z-20 w-full h-full bg-cover gloss bg-radial from-black from-20% via-neutral-300 to-80% to-black opacity-0 mix-blend-color-dodge"></div>
            )}
            <img
              src={`https://steamcdn-a.akamaihd.net/steam/apps/${appId}/header.jpg`}
              alt={name}
              className="size-full object-cover"
            />
          </div>
        </div>
      </Link>
    </div>
  );
}
