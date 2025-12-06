import { Link } from "@tanstack/react-router";
import { useApp } from "../../context/useApp";
import NoiseBox from "../NoiseBox";

export interface AppIconProps {
  name: string;
  path: string;
  appId?: string;
  focused?: boolean;
}

export function AppIcon({ name, path, appId, focused = false }: AppIconProps) {
  const { activeApp } = useApp();
  const isActive = activeApp === appId;

  return (
    <Link to={path}>
      <div
        className={`icon will-change-transform transition-all ${
          isActive ? "scale-150 my-5" : focused ? "scale-110 my-2" : ""
        }`}
      >
        <div className="relative p-[4px] size-20 ">
          <div
            className={`absolute w-full h-full inset-0 transition-[opacity_scale] noise-mask rounded-xl scale-100`}
          >
            {(isActive || focused) && (
              <div className={`absolute -inset-[2px] ${isActive ? "opacity-70" : "opacity-40"}`}>
                <NoiseBox />
              </div>
            )}
          </div>
          <div className="relative w-full h-full text-white bg-neutral-900 rounded-lg overflow-hidden shadow-lg">
            {isActive && (
              <div className="absolute z-20 w-full h-full bg-cover gloss bg-radial from-black from-20% via-neutral-300 to-80% to-black opacity-0 mix-blend-color-dodge"></div>
            )}
            <img
              src={`https://steamcdn-a.akamaihd.net/steam/apps/${appId}/header.jpg`}
              alt=""
              className="size-full object-cover"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
