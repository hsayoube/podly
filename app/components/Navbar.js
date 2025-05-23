'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import ThemeSwitcher from './ThemeSwitcher';
import AnimatedLogo from './AnimatedLogo';

const Navbar = () => {
    return (
        <motion.nav
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 12 }}
            className="backdrop-blur-md shadow-md fixed top-0 w-full z-40 border-b border-gray-200 dark:border-gray-700"
        >
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* Brand */}
                <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                >
                    <Link
                        href="/"
                        className="text-3xl font-extrabold bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 bg-clip-text text-transparent hover:brightness-110 transition duration-300"
                        style={{ fontFamily: "'Pacifico', cursive" }}
                    >
                        <AnimatedLogo />
                    </Link>
                </motion.div>

                <div className="flex items-center gap-3">
                    {/* Subscribe button */}
                    <Link
                        href="/sub"
                        className="px-5 py-2 rounded-lg text-white font-medium bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 hover:from-blue-700 hover:via-purple-800 hover:to-pink-600 shadow-md hover:shadow-lg transition duration-300"
                    >
                        Subscribe
                    </Link>

                    {/* Theme Switcher */}
                    <motion.span
                        className="cursor-pointer ml-1"
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        whileTap={{ scale: 0.95, rotate: -10 }}
                        transition={{ type: 'spring', stiffness: 150, damping: 15 }}
                    >
                        <ThemeSwitcher />
                    </motion.span>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
