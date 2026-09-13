import { useState, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Image } from "@/components/ui/image";

const INTERVAL = 5000;

export default function HeroSlider({ images = [], alt = "" }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduce || images.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, INTERVAL);
    return () => clearInterval(id);
  }, [images.length, reduce]);

  if (!images.length) return null;

  return (
    <div className="absolute inset-0">
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: reduce ? 0 : 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={images[index]}
            alt={alt}
            fittingType="fill"
            priority
            className="h-full w-full object-cover opacity-70"
          />
        </motion.div>
      </AnimatePresence>

      {/* Progress indicators */}
      {images.length > 1 && !reduce && (
        <div className="absolute bottom-20 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className="group relative h-0.5 w-12 overflow-hidden bg-white/20"
              aria-label={`Image ${i + 1}`}
            >
              {i === index && (
                <motion.span
                  key={index}
                  className="absolute inset-0 bg-accent-lime"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: INTERVAL / 1000, ease: "linear" }}
                  style={{ transformOrigin: "left" }}
                />
              )}
              {i !== index && <span className="absolute inset-0 bg-white/0 group-hover:bg-white/40" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}