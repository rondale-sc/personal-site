import type { CollectionEntry } from 'astro:content';

type Post = CollectionEntry<'posts'>;

export function getPostSlug(post: Post): string {
  if (post.data.slug) return post.data.slug;
  const filename = post.id.split('/').pop() ?? post.id;
  return filename.replace(/\.mdx?$/, '');
}

export function getPostHref(post: Post): string {
  const slug = getPostSlug(post);
  switch (post.data.type) {
    case 'project': return `/projects/${slug}`;
    case 'radio':   return `/interests/radio/${slug}`;
    case 'writing': return `/writing/${slug}`;
  }
}
