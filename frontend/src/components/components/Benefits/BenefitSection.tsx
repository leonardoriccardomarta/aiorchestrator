"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import BenefitBullet from "./BenefitBullet";
import SectionTitle from "../SectionTitle";
import { childVariants } from "./animations";

interface BenefitSectionProps {
  title: string;
  description: string;
  bullets: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
}

const containerVariants: Variants = {
  offscreen: { opacity: 0, y: 100 },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      bounce: 0.2,
      duration: 0.9,
      delayChildren: 0.2,
      staggerChildren: 0.1,
    },
  },
};

const BenefitSection: React.FC<BenefitSectionProps> = ({ title, description, bullets }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="text-center"
        >
          <SectionTitle>
            <h3>{title}</h3>
          </SectionTitle>
          <motion.p
            variants={childVariants}
            className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto"
          >
            {description}
          </motion.p>
        </motion.div>

        <div className="mt-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bullets.map((item, index: number) => (
              <BenefitBullet
                key={index}
                title={item.title}
                description={item.description}
                icon={item.icon}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitSection;
