import { Variants } from "framer-motion";

export const childVariants: Variants = {
  offscreen: { opacity: 0, x: -50 },
  onscreen: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", bounce: 0.2, duration: 1 },
  },
};