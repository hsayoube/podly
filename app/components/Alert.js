'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, CheckCircle2, Info, Ban, Smile, Frown } from 'lucide-react';

export default function Alert({ type = 'error', message }) {
  const [visible, setVisible] = useState(true);

  const baseStyles = {
    error: {
      bg: 'bg-red-200 dark:bg-red-900',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-700 dark:text-red-300',
      icon: <Ban className="w-6 h-6 text-red-500 dark:text-red-400" />,
    },
    success: {
      bg: 'bg-green-200 dark:bg-green-950',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-700 dark:text-green-300',
      icon: <CheckCircle2 className="w-6 h-6 text-green-500 dark:text-green-400" />,
    },
    warning: {
      bg: 'bg-yellow-200 dark:bg-yellow-900',
      border: 'border-yellow-200 dark:border-yellow-700',
      text: 'text-yellow-700 dark:text-yellow-300',
      icon: <AlertTriangle className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />,
    },
    info: {
      bg: 'bg-blue-200 dark:bg-blue-900',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-700 dark:text-blue-300',
      icon: <Info className="w-6 h-6 text-blue-500 dark:text-blue-400" />,
    },
    happy: {
      bg: 'bg-green-200 dark:bg-green-950',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-700 dark:text-green-300',
      icon: <Smile className="w-6 h-6 text-green-500 dark:text-green-400" />,
    },
    sad: {
      bg: 'bg-red-200 dark:bg-red-900',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-700 dark:text-red-300',
      icon: <Frown className="w-6 h-6 text-red-500 dark:text-red-400" />,
    },
  };

  const style = baseStyles[type] || baseStyles.error;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4"
        >
          <div
            className={`${style.bg} ${style.border} ${style.text} border px-4 py-3 rounded-xl flex items-center gap-3 shadow-md`}
            role="alert"
          >
            <div>{style.icon}</div>
            <div className="flex-1 text-sm leading-relaxed">
              {(type !== "happy" && type !== "sad") && <strong className="block font-semibold capitalize">{type}</strong>}
              <span className="block">{message}</span>
            </div>
            <button
              onClick={() => setVisible(false)}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
