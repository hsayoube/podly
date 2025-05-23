'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { sendEmail } from '../actions/sendEmail';

export default function SubscribeModal({ isOpen, setIsOpen }) {
    const router = useRouter();
    const formRef = useRef(null);

    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleClose = () => {
        router.replace("/")
        setIsOpen(false);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const email = formRef.current.email.value.trim();
        if (email && !submitted) {
            sendEmail(email, "subscribe");
            setSubmitted(true);
            router.replace(`/sub?email=${email}`);
        }
    };

    const modalBackdrop = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
    };

    const modalContainer = {
        hidden: { opacity: 0, scale: 0.95, y: 40 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 18, stiffness: 200 } },
        exit: { opacity: 0, scale: 0.95, y: 40, transition: { duration: 0.2 } },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        variants={modalBackdrop}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={handleClose}
                    >

                        {/* Modal container */}
                        <motion.div
                            className="fixed inset-0 z-50 flex items-center justify-center"
                            variants={modalContainer}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <motion.div
                                className="relative bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 w-full max-w-md mx-4 sm:mx-0 p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700"
                                onClick={(e) => e.stopPropagation()}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                {/* Close button */}
                                <button
                                    onClick={handleClose}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
                                    aria-label="Close modal"
                                >
                                    <X size={22} />
                                </button>

                                {/* Content */}
                                <motion.h2
                                    className="text-2xl sm:text-3xl font-bold mb-2 text-center"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                >
                                    Stay Updated!
                                </motion.h2>

                                <motion.p
                                    className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    Enter your email to receive the latest podcast picks and updates.
                                </motion.p>

                                <motion.form
                                    ref={formRef}
                                    onSubmit={handleSubmit}
                                    className="flex items-center justify-between w-full max-w-xl mx-auto mt-12 px-4 py-3 rounded-2xl bg-gray-200 dark:bg-gray-800 shadow-neumorphic dark:shadow-neumorphic-dark border-2 border-transparent focus-within:border-blue-500"
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
                                >
                                    <motion.input
                                        type="text"
                                        name="email"
                                        placeholder="you@example.com"
                                        autoComplete="off"
                                        className="flex-1 text-sm bg-transparent placeholder-gray-500 dark:placeholder-gray-400 text-gray-800 dark:text-gray-100 focus:outline-none px-3"
                                        autoFocus
                                    />

                                    <motion.button
                                        type="submit"
                                        className="ml-4 px-5 py-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-medium shadow-md hover:shadow-lg transition"
                                        whileHover={{ scale: 1.07 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Subscribe
                                    </motion.button>
                                </motion.form>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
