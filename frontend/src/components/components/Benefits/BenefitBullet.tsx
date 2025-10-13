import React from "react";
import { motion } from "framer-motion";

interface BenefitBulletProps {
  title: string;
  description: string;
  icon: string;
}

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const BenefitBullet: React.FC<BenefitBulletProps> = ({ title, description, icon }) => {
  return (
    <motion.div
      className="flex items-start gap-4"
      variants={childVariants}
    >
      <div className="text-primary mt-1">{icon}</div>
      <div>
        <h4 className="text-lg font-semibold">{title}</h4>
        <p className="text-foreground-accent">{description}</p>
      </div>
    </motion.div>
  );
};

export default BenefitBullet;
