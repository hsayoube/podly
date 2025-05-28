'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PodcastCard from './components/PodcastCard';
import SearchBar from './components/SearchBar';
import Alert from './components/Alert';
import StickyPlayer from './components/StickyPlayer';
import { APP_NAME } from './config';
import AnimatedHeading from './components/AnimatedHeading';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [podcasts, setPodcasts] = useState([]);
  const [selectedPodcast, setSelectedPodcast] = useState(null);

  const [searchTerm, setSearchTerm] = useState('tech');
  const [isPlaying, setIsPlaying] = useState(false);

  const [visibleCount, setVisibleCount] = useState(16);
  const loadMoreRef = useRef(null);

  const searchParam = useSearchParams();
  const hasEmail = !!searchParam.get("email");

  const [unsubModalOpen, setUnsubModalOpen] = useState(!hasEmail)

  const filterValidPodcasts = async (podcasts) => {
    if (!podcasts) return [];

    const podcastChecks = await Promise.all(
      podcasts.map(async (podcast) => {
        const hasRequiredFields =
          podcast.trackId &&
          podcast.artistName &&
          podcast.collectionName &&
          podcast.artworkUrl600 &&
          podcast.feedUrl;

        if (!hasRequiredFields) return null;

        try {
          const res = await fetch(podcast.feedUrl, { method: 'HEAD' });
          if (!res.ok) return null;
          return podcast;
        } catch {
          return null;
        }
      })
    );

    return podcastChecks.filter(Boolean);
  };

  const fetchPodcasts = useCallback(async (term = 'tech') => {
    setLoading(true);
    setPodcasts([]);
    setVisibleCount(10);
    const res = await fetch(`https://itunes.apple.com/search?media=podcast&term=${term}&limit=200`);
    const data = await res.json();
    const validPodcasts = await filterValidPodcasts(data.results);
    setPodcasts(validPodcasts);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPodcasts(searchTerm);
  }, [fetchPodcasts, searchTerm]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 10, podcasts.length));
        }
      },
      { root: null, rootMargin: '0px', threshold: 1.0 }
    );

    const el = loadMoreRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [podcasts.length]);

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-colors duration-500">
      {/* Alert Section */}
      {hasEmail && <Alert type='sad' message="We're sorry to see you go" />}

      {/* Unsubscribe modal */}
      <UnsubscribeModal isOpen={unsubModalOpen} setIsOpen={setUnsubModalOpen} />

      <section className="pt-24 pb-20 sm:pt-28 text-center">
        <AnimatedHeading appName={APP_NAME} />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-8"
        >
          Discover trending and curated podcasts. Explore, listen, and stay inspired with{" "}
          <span className="bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]" style={{ fontFamily: "'Pacifico', cursive" }}>
            {APP_NAME}
          </span>
          {" "}— your podcast discovery companion.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.4 }}
        >
          <SearchBar setSearchTerm={setSearchTerm} />
        </motion.div>
      </section>

      {/* Loading Skeleton */}
      {loading && podcasts?.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-8"
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="h-48 rounded-xl animate-pulse bg-gradient-to-br from-gray-500 via-gray-600 to-gray-500 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800"
              whileHover={{ scale: 1.03 }}
            />
          ))}
        </motion.div>
      )}

      {/* Results */}
      {!loading && podcasts?.length > 0 && (
        <motion.div
          className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 px-2 sm:px-0"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {podcasts
            .slice(0, visibleCount)
            .map((podcast) => (
              <motion.div
                key={podcast.trackId}
                variants={cardVariants}
                whileHover={{
                  scale: 1.05,
                  rotate: 0.5,
                  filter: 'brightness(1.1)',
                }}
                className="transition-all duration-300 shadow-md shadow-purple-400/80 dark:shadow-purple-500/40 bg-zinc-400/50 dark:bg-zinc-800/80 backdrop-blur-md p-2 rounded-xl"
              >
                <PodcastCard
                  podcast={podcast}
                  onClick={() => setSelectedPodcast(podcast)}
                />
              </motion.div>
            ))}
          <div ref={loadMoreRef} className="h-8" />
        </motion.div>
      )}

      {/* No Results */}
      {!loading && podcasts?.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-10"
        >
          <Alert type="sad" message={`No Podcast found for "${searchTerm}"`} />
        </motion.div>
      )}

      {/* Modal / Sticky Player */}
      <AnimatePresence>
        {selectedPodcast && (
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
          >
            <StickyPlayer
              currentCollection={selectedPodcast}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
