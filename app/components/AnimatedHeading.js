'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const phrases = [
    'Discover podcasts',
    'Stream your favorites',
    'Stay inspired daily',
    'Welcome to ',
];

export default function AnimatedHeading({ appName }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % phrases.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative min-h-[100px]">
            <AnimatePresence mode="wait">
                <motion.h1
                    key={index}
                    initial={{ opacity: 0, y: -40, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 40, scale: 0.95 }}
                    transition={{
                        type: 'spring',
                        stiffness: 120,
                        damping: 14,
                        duration: 0.6,
                    }}
                    className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-br from-blue-500 to-purple-600 text-transparent bg-clip-text pb-6 text-center"
                    style={{ fontFamily: "'Pacifico', cursive" }}
                >
                    {phrases[index] === 'Welcome to ' ? (
                        <>
                            {phrases[index]}
                            <span className="bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                                {appName}
                            </span>
                        </>
                    ) : (
                        phrases[index]
                    )}
                </motion.h1>
            </AnimatePresence>
        </div>
    );
}
