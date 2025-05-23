import { SWRConfig } from 'swr';

const cacheWithTTL = () => {
  const cache = new Map();

  return {
    get(key) {
      const cached = cache.get(key);
      if (!cached) return undefined;

      const [value, timestamp] = cached;
      const age = Date.now() - timestamp;
      if (age > 60000) {
        cache.delete(key); // TTL = 60s
        return undefined;
      }
      return value;
    },
    set(key, value) {
      cache.set(key, [value, Date.now()]);
    },
    delete(key) {
      cache.delete(key);
    },
    clear() {
      cache.clear();
    },
  };
};


export default cacheWithTTL;