'use client';

import { motion } from 'framer-motion';
import { APP_NAME } from '../config';

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.2,
      ease: 'easeOut',
    },
  },
};

const letter = {
  hidden: { opacity: 0, y: 20, rotate: -5 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1], // smooth spring-like
    },
  },
};

export default function AnimatedLogo() {
  return (
    <motion.h1
      className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-purple-800 text-center py-3"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {APP_NAME.split('').map((char, index) => (
        <motion.span
          key={index}
          variants={letter}
          className="inline-block"
        >
          {char}
        </motion.span>
      ))}
    </motion.h1>
  );
}
