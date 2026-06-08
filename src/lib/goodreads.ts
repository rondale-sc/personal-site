export interface GoodreadsBook {
  title: string;
  author: string;
  cover: string;
  rating: number;
  avgRating: number;
  published: string;
  link: string;
  dateAdded: string;
}

const USER_ID = '200941836';

function extract(item: string, tag: string): string {
  const re = new RegExp(`<${tag}>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`);
  return (item.match(re)?.[1] ?? '').trim();
}

function parseItems(xml: string): GoodreadsBook[] {
  return xml
    .split('<item>')
    .slice(1)
    .map(item => ({
      title:     extract(item, 'title'),
      author:    extract(item, 'author_name'),
      cover:     extract(item, 'book_large_image_url') || extract(item, 'book_medium_image_url'),
      rating:    parseInt(extract(item, 'user_rating')) || 0,
      avgRating: parseFloat(extract(item, 'average_rating')) || 0,
      published: extract(item, 'book_published'),
      link:      extract(item, 'guid'),
      dateAdded: extract(item, 'user_date_added'),
    }))
    .filter(b => b.title);
}

export async function fetchShelf(shelf: string): Promise<GoodreadsBook[]> {
  try {
    const url = `https://www.goodreads.com/review/list_rss/${USER_ID}?shelf=${shelf}&sort=date_read&order=d`;
    const res = await fetch(url);
    if (!res.ok) return [];
    return parseItems(await res.text());
  } catch {
    return [];
  }
}
