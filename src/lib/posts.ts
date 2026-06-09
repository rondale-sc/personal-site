import type { CollectionEntry } from 'astro:content';

type Post = CollectionEntry<'posts'>;

export function getPostSlug(post: Post): string {
  if (post.data.slug) return post.data.slug;
  return post.id.replace(/\.mdx?$/, '');
}

export function getPostHref(post: Post): string {
  return `/posts/${getPostSlug(post)}`;
}
