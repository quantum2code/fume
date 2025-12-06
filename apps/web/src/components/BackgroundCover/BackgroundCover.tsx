import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";

interface BackgroundCoverProps {
  backgroundImage: string | null;
}

export function BackgroundCover({ backgroundImage }: BackgroundCoverProps) {
  const [outgoingImage, setOutgoingImage] = useState<string | null>(null);
  const [incomingImage, setIncomingImage] = useState<string | null>(null);
  const debounceTimerRef = useRef<number | null>(null);
  useEffect(() => {
    const currentImage = incomingImage;

    if (debounceTimerRef.current !== null) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      if (backgroundImage) {
        setOutgoingImage(currentImage);
        setIncomingImage(backgroundImage);
      } else {
        setIncomingImage(null);
        setOutgoingImage(currentImage);
      }
    }, 200);
    return () => {
      if (debounceTimerRef.current != null) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
    };
  }, [backgroundImage]);

  return (
    <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
      {/* Outgoing image layer */}
      {outgoingImage && (
        <motion.div
          key={`outgoing-${outgoingImage}`}
          initial={{ opacity: 1, x: 0 }}
          animate={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          onAnimationComplete={() => setOutgoingImage(null)}
          className="absolute left-[-20px] top-0 bottom-0 w-[calc(100%+20px)] h-full"
        >
          <img
            src={outgoingImage}
            alt=""
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
      )}
      {/* Incoming image layer */}
      {incomingImage && (
        <motion.div
          key={`incoming-${incomingImage}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute left-[-20px] top-0 bottom-0 w-[calc(100%+20px)] h-full"
        >
          <img
            src={incomingImage}
            alt=""
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
      )}
      {/* Vignette overlay */}
      <div className="absolute inset-0 w-full h-full pointer-events-none bg-radial-[at_70%_50%] from-transparent to-black/80 " />
    </div>
  );
}
