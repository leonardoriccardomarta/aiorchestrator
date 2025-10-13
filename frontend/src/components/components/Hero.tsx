"use client";

import React from 'react';
import Image from 'next/image';
import { heroDetails } from '@/data/hero';

const Hero: React.FC = () => {
  const openChatDemo = () => {
    const event = new CustomEvent("open-chat-demo");
    window.dispatchEvent(event);
  };

  return (
    <section
      id="hero"
      className="relative flex items-center justify-center pt-32 md:pt-40 pb-0 px-5"
    >
      <div className="absolute inset-0 -z-10 w-full h-full bg-hero-background bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]" />
      <div className="absolute left-0 right-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-[rgba(233,238,255,0.5)] to-[rgba(202,208,230,0.5)] backdrop-blur-[2px]" />

      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground max-w-2xl mx-auto">
          {heroDetails.heading}
        </h1>
        <p className="mt-4 text-foreground max-w-lg mx-auto">
          {heroDetails.subheading}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <a href="#pricing">
            <button className="px-6 py-3 rounded-full bg-black text-white font-medium hover:bg-neutral-800">
              View Plans →
            </button>
          </a>
          <button
            onClick={openChatDemo}
            className="px-6 py-3 rounded-full border border-black text-black font-medium hover:bg-neutral-100"
          >
            Try Demo
          </button>
        </div>

        <Image
          src={heroDetails.centerImageSrc}
          width={384}
          height={340}
          quality={100}
          sizes="(max-width: 768px) 100vw, 384px"
          priority={true}
          unoptimized={true}
          alt="Chatbot mockup"
          className="relative mt-12 md:mt-16 mx-auto z-10"
        />
      </div>
    </section>
  );
};

export default Hero;
