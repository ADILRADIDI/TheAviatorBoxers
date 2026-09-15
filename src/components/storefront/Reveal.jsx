import { motion, useReducedMotion } from "framer-motion";

// Scroll-triggered reveal wrapper. Respects prefers-reduced-motion.
// variant="fade"   -> soft up-fade (default)
// variant="mask"   -> clip-path wipe up (editorial headline reveal)
// variant="scale"  -> gentle zoom-in
export default function Reveal({ children, delay = 0, y = 24, variant = "fade", className, as = "div" }) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] || motion.div;

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  const variants = {
    fade: { initial: { opacity: 0, y }, enter: { opacity: 1, y: 0 } },
    mask: {
      initial: { opacity: 0, clipPath: "inset(0 0 100% 0)" },
      enter: { opacity: 1, clipPath: "inset(0 0 0% 0)", y: 0 },
    },
    scale: { initial: { opacity: 0, scale: 0.96 }, enter: { opacity: 1, scale: 1 } },
  }[variant];

  return (
    <MotionTag
      className={className}
      initial={variants.initial}
      whileInView={variants.enter}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: variant === "mask" ? 0.9 : 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  );
}