import { useRef, useEffect } from "react";
import { useInView } from "motion/react";
import { useApp } from "../context/AppContext";

interface BarTriggerViewProps {
  children?: React.ReactNode;
  className?: string;
}

export function BarTriggerView({ children, className }: BarTriggerViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref);
  const { setBarHidden } = useApp();

  useEffect(() => {
    setBarHidden(isInView);
  }, [isInView, setBarHidden]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
