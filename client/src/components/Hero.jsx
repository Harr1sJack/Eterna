import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <div className="bg-base-100">
      <div
        className="hero h-[50vh]"
        style={{
          backgroundImage: `url(assets/bg.jpg)`,
        }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-neutral-content text-center mt-12">
          <div className="max-w-screen-md">
            {/* Animated Heading */}
            <AnimatedHeading
              lines={[
                'BUY AND SELL',
                'RARE AND EXCLUSIVE PRODUCTS',
              ]}
            />

            {/* Subtext */}
            <p className="mb-5 text-lg font-sans">
              Discover antiques, collectibles, and limited edition treasures—or list your own!
            </p>

            {/* Buttons */}
            <div className="flex items-center gap-x-6 justify-center">
              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Link
                  to="/explore"
                  className="w-48 px-6 py-3 font-medium bg-[#431363] text-white border border-[#4f2478]
                    shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]
                    transition-all rounded-md text-lg text-center"
                >
                  Explore Products
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -3 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Link
                  to="/upload"
                  className="w-48 px-6 py-3 font-medium bg-[#431363] text-white border border-[#4f2478]
                    shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]
                    transition-all rounded-md text-lg text-center"
                >
                  Upload Product
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Animation constants
const DURATION = 0.25;
const STAGGER = 0.025;

const AnimatedHeading = ({ lines }) => {
  return (
    <h1 className="mb-5 text-5xl font-bold font-sans leading-tight">
      {lines.map((line, lineIdx) => (
        <motion.div
          key={lineIdx}
          initial="initial"
          whileHover="hovered"
          className="relative block overflow-hidden mb-2"
        >
          {/* Top Line */}
          <div>
            {line.split('').map((char, i) => (
              <motion.span
                key={i}
                variants={{
                  initial: { y: 0 },
                  hovered: { y: '-100%' },
                }}
                transition={{
                  duration: DURATION,
                  ease: 'easeInOut',
                  delay: STAGGER * i,
                }}
                className="inline-block"
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </div>
          {/* Bottom Line (overlay) */}
          <div className="absolute inset-0">
            {line.split('').map((char, i) => (
              <motion.span
                key={i}
                variants={{
                  initial: { y: '100%' },
                  hovered: { y: 0 },
                }}
                transition={{
                  duration: DURATION,
                  ease: 'easeInOut',
                  delay: STAGGER * i,
                }}
                className="inline-block"
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </div>
        </motion.div>
      ))}
    </h1>
  );
};

export default Hero;