'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

export default function SearchBar({ setSearchTerm }) {
    const formRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const term = formRef.current.term.value.trim();
        if (term) setSearchTerm(term);
    };

    return (
        <motion.form
            ref={formRef}
            onSubmit={handleSubmit}
            className="flex items-center justify-between w-full max-w-xl mx-auto mt-12 px-4 py-3 rounded-2xl bg-gray-200 dark:bg-gray-800 shadow-neumorphic dark:shadow-neumorphic-dark border-2 border-transparent focus-within:border-blue-500 transition duration-300"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
        >
            <motion.input
                type="text"
                name="term"
                placeholder="Search for podcasts..."
                autoComplete="off"
                className="flex-1 text-sm bg-transparent placeholder-gray-500 dark:placeholder-gray-400 text-gray-800 dark:text-gray-100 focus:outline-none px-3"
            />

            <motion.button
                type="submit"
                className="ml-4 px-5 py-2 rounded-xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 hover:from-blue-700 hover:via-purple-800 hover:to-pink-600 text-white text-sm font-medium shadow-md hover:shadow-lg transition duration-300"
            >
                <Search size={20} />
            </motion.button>
        </motion.form>
    );
}
