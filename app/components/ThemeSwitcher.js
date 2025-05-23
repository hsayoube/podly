"use client"

import { useTheme } from "../context/ThemeContext";
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

const ThemeSwitcher = () => {
    const { theme, toggleTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null; // Prevent SSR mismatch

    return (
        <motion.button
            onClick={toggleTheme}
            className="p-2 rounded text-black dark:text-white"
            key={theme}
            initial={{ rotate: 180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
        >
            {theme === 'light' ? <Sun size={24} /> : <Moon size={24} />}
        </motion.button>
    );
};

export default ThemeSwitcher;
