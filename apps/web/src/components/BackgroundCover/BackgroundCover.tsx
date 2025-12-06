import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";

interface BackgroundCoverProps {
  backgroundImage: string | null;
}

export function BackgroundCover({ backgroundImage }: BackgroundCoverProps) {
  const [outgoingImage, setOutgoingImage] = useState<string | null>(null);
  const [incomingImage, setIncomingImage] = useState<string | null>(null);
  const previousImageRef = useRef<string | null>(null);

  useEffect(() => {
    // If the image hasn't changed, do nothing
    if (backgroundImage === previousImageRef.current) {
      return;
    }

    const currentIncoming = incomingImage;
    previousImageRef.current = backgroundImage;

    // Preload and set the new image
    if (backgroundImage) {
      const img = new Image();
      img.onload = () => {
        // Update outgoing image in the callback (async, not in effect body)
        if (currentIncoming) {
          setOutgoingImage(currentIncoming);
        }
        // Update incoming image in callback
        setIncomingImage(backgroundImage);
        // Clear outgoing image after transition completes
        setTimeout(() => {
          setOutgoingImage(null);
        }, 1000);
      };
      img.onerror = () => {
        // On error, keep the current image
      };
      img.src = backgroundImage;
    } else {
      // Clearing the background
      if (currentIncoming) {
        // Defer state updates using setTimeout to avoid synchronous setState
        setTimeout(() => {
          setOutgoingImage(currentIncoming);
          setIncomingImage(null);
          setTimeout(() => {
            setOutgoingImage(null);
          }, 1000);
        }, 0);
      }
    }
  }, [backgroundImage, incomingImage]);

  return (
    <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
      {/* Outgoing image layer */}
      {outgoingImage && (
        <motion.div
          key={`outgoing-${outgoingImage}`}
          initial={{ opacity: 1, x: 0 }}
          animate={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
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
