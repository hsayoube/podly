'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function PodcastCard({ podcast, onClick }) {
    return (
        <motion.div
            layout
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition"
            onClick={onClick}
        >
            <Image
                src={podcast.artworkUrl600}
                alt={podcast.collectionName}
                width={600}
                height={600}
                className="w-full h-48 object-cover"
                loading='lazy'
            />
            <div className="p-4">
                <h2 className="font-semibold text-sm truncate">{podcast.collectionName}</h2>
                <p className="text-xs text-gray-500 truncate">{podcast.artistName}</p>
            </div>
        </motion.div>
    );
}
