import { parseStringPromise } from 'xml2js';
import { parse, format, formatDistanceToNow, differenceInDays } from 'date-fns';

export async function ParseRSS(feedUrl) {
  const res = await fetch(feedUrl);
  const xml = await res.text();
  const data = await parseStringPromise(xml);

  const items = data?.rss?.channel[0]?.item || [];

  return items.map((item) => {
    const rawDate = item.pubDate?.[0] || '';
    const parsedDate = rawDate
      ? parse(rawDate, 'EEE, dd MMM yyyy HH:mm:ss xx', new Date())
      : null;

    let displayDate = '';
    if (parsedDate) {
      const daysAgo = differenceInDays(new Date(), parsedDate);
      displayDate =
        daysAgo < 30
          ? formatDistanceToNow(parsedDate, { addSuffix: true }) // e.g., "5 days ago"
          : format(parsedDate, 'PPP'); // e.g., "May 21, 2025"
    }

    return {
      title: item.title?.[0] || '',
      audioUrl: item.enclosure?.[0]?.$.url || '',
      description: item.description?.[0] || '',
      pubDate: displayDate,
      image: item['itunes:image']?.[0]?.$.href || '',
      author: item['itunes:author']?.[0] || '',
    };
  });
}
