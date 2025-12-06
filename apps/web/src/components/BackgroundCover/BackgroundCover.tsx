import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";

interface BackgroundCoverProps {
  backgroundImage: string | null;
}

export function BackgroundCover({ backgroundImage }: BackgroundCoverProps) {
  const [outgoingImage, setOutgoingImage] = useState<string | null>(null);
  const [incomingImage, setIncomingImage] = useState<string | null>(null);
  const debounceTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Clear any pending debounce timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Debounce: wait 100ms before processing
    debounceTimeoutRef.current = setTimeout(() => {
      const currentIncoming = incomingImage;

      // Preload and set the new image
      if (backgroundImage) {
        const img = new Image();
        img.onload = () => {
          // Update outgoing image if there was a previous one
          if (currentIncoming) {
            setOutgoingImage(currentIncoming);
          }
          // Update incoming image
          setIncomingImage(backgroundImage);
        };
        img.onerror = () => {
          // On error, keep the current image
        };
        img.src = backgroundImage;
      } else {
        // Clearing the background
        if (currentIncoming) {
          setOutgoingImage(currentIncoming);
          setIncomingImage(null);
        }
      }
      debounceTimeoutRef.current = null;
    }, 200);

    // Cleanup: cancel timeout if effect re-runs
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
      }
    };
  }, [backgroundImage]); // eslint-disable-line react-hooks/exhaustive-deps

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
