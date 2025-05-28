'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, Pause, Play, FastForward, Rewind } from 'lucide-react';
import { ParseRSS } from '../utils/ParseRSS';
import Image from 'next/image';

const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
};

export default function StickyPlayer({ currentCollection, isPlaying, onTogglePlay }) {
    const [expanded, setExpanded] = useState(false);
    const [episodes, setEpisodes] = useState([]);
    const [podcastInfo, setPodcastInfo] = useState({});
    const [currentTrack, setCurrentTrack] = useState(null);

    const audioRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [visibleCount, setVisibleCount] = useState(10);
    const loadMoreRef = useRef(null);

    const feedUrl = currentCollection?.feedUrl;

    useEffect(() => {
        let ignore = false;
        setExpanded(false);
        setEpisodes([]);
        setPodcastInfo({});
        setCurrentTrack(null);
        setVisibleCount(10);

        const fetchFeed = async () => {
            if (!feedUrl) return;
            try {
                const items = await ParseRSS(feedUrl);
                if (!ignore && items.length > 0) {
                    setEpisodes(items);
                    setPodcastInfo({
                        image: currentCollection?.artworkUrl600,
                        title: currentCollection?.collectionName,
                        author: currentCollection?.artistName,
                    });
                    setCurrentTrack(items[0]);
                }
            } catch (err) {
                console.error('Failed to fetch feed:', err);
            }
        };
        fetchFeed();
        return () => { ignore = true; };
    }, [feedUrl, currentCollection]);

    useEffect(() => {
        if (!expanded) {
            setVisibleCount(10);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisibleCount((prev) => Math.min(prev + 10, episodes.length));
                }
            },
            { threshold: 1.0 }
        );

        const el = loadMoreRef.current;
        if (el) observer.observe(el);
        return () => { if (el) observer.unobserve(el); };
    }, [expanded, episodes.length]);

    useEffect(() => {
        if (audioRef.current) {
            isPlaying ? audioRef.current.play() : audioRef.current.pause();
        }
    }, [isPlaying, currentTrack]);

    const handleTimeUpdate = () => {
        if (!audioRef.current) return;
        setProgress(audioRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
    };

    const handleSeek = (e) => {
        const newTime = parseFloat(e.target.value);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
            setProgress(newTime);
        }
    };

    const handleNext = () => {
        const idx = episodes.findIndex(ep => ep.audioUrl === currentTrack.audioUrl);
        if (idx < episodes.length - 1) setCurrentTrack(episodes[idx + 1]);
    };

    const handlePrev = () => {
        const idx = episodes.findIndex(ep => ep.audioUrl === currentTrack.audioUrl);
        if (idx > 0) setCurrentTrack(episodes[idx - 1]);
    };

    if (!currentTrack) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-50 rounded-xl bg-zinc-400/80 dark:bg-zinc-800/80 backdrop-blur-md shadow-md shadow-purple-400/80 dark:shadow-purple-500/40 p-2">
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                exit={{ y: 100 }}
                transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                className="bg-gray-200/60 dark:bg-gray-900/60 backdrop-blur-md shadow-2xl rounded-xl"
            >
                <AnimatePresence>
                    {expanded && (
                        <motion.div
                            key="expanded"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="max-h-[60vh] overflow-y-auto border-t border-gray-200 dark:border-gray-700"
                        >
                            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
                                <div className="flex items-center gap-6 mb-6">
                                    <Image
                                        src={podcastInfo.image}
                                        alt="Podcast cover"
                                        width={80}
                                        height={80}
                                        className="w-20 h-20 rounded-lg object-cover"
                                        unoptimized
                                    />
                                    <div>
                                        <h2 className="text-xl font-bold">{podcastInfo.title}</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{podcastInfo.author}</p>
                                    </div>
                                </div>
                                <ul className="space-y-4">
                                    {episodes.slice(0, visibleCount).map((ep, i) => {
                                        const isTrackPlaying = currentTrack?.audioUrl === ep.audioUrl;
                                        return (
                                            <li
                                                key={i}
                                                onClick={() => {
                                                    setCurrentTrack(ep);
                                                    setProgress(0);
                                                    setDuration(0);
                                                }}
                                                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                                            >
                                                <div className="relative min-w-[60px]">
                                                    <Image
                                                        src={ep?.image || podcastInfo.image}
                                                        alt={ep?.title}
                                                        width={64}
                                                        height={64}
                                                        className="w-16 h-16 rounded-md object-cover"
                                                        unoptimized
                                                    />
                                                    {isTrackPlaying && (
                                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-md">
                                                            <Play size={20} className="text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <h3 className="text-sm font-semibold truncate">{ep.title}</h3>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{ep.pubDate}</p>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                                <div ref={loadMoreRef} className="h-8" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Mini Player Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 gap-3">
                    <button
                        onClick={() => setExpanded((prev) => !prev)}
                        aria-label="Toggle episode list"
                        className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition sm:order-last sm:ml-6"
                    >
                        {expanded ? <ChevronDown size={22} /> : <ChevronUp size={22} />}
                    </button>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Image
                            src={currentTrack?.image || podcastInfo.image}
                            alt="Now playing"
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-md object-cover"
                            unoptimized
                        />
                        <div className="truncate">
                            <h3 className="text-sm font-medium truncate">{currentTrack.title}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentTrack.pubDate}</p>
                        </div>
                    </div>

                    <audio
                        ref={audioRef}
                        src={currentTrack.audioUrl}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        hidden
                    />

                    <div className="flex flex-col sm:flex-row items-center gap-4 sm:justify-end w-full">
                        {/* Timeline section */}
                        <div className="flex items-center gap-2 w-full sm:flex-1 sm:order-2 order-1 max-w-xl">
                            <input
                                type="range"
                                min="0"
                                max={duration}
                                step="0.1"
                                value={progress}
                                onChange={handleSeek}
                                className="w-full h-1 bg-gray-400 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-xs text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                {formatTime(progress)} / {formatTime(duration)}
                            </span>
                        </div>

                        {/* Control buttons */}
                        <div className="flex items-center justify-center gap-4 w-full sm:w-auto order-2 sm:order-1">
                            <button
                                onClick={handlePrev}
                                className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
                                aria-label="Previous"
                            >
                                <Rewind size={22} />
                            </button>
                            <button
                                onClick={onTogglePlay}
                                className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
                                aria-label={isPlaying ? 'Pause' : 'Play'}
                            >
                                {isPlaying ? <Pause size={22} /> : <Play size={22} />}
                            </button>
                            <button
                                onClick={handleNext}
                                className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
                                aria-label="Next"
                            >
                                <FastForward size={22} />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
