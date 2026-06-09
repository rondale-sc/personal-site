import type { CollectionEntry } from 'astro:content';

type Post = CollectionEntry<'posts'>;

export function getPostSlug(post: Post): string {
  if (post.data.slug) return post.data.slug;
  return post.id.replace(/\.mdx?$/, '');
}

export function getPostHref(post: Post): string {
  switch (post.data.type) {
    case 'project':
      // Link to the parent project page if one is set, otherwise fall back to slug
      return post.data.project ? `/projects/${post.data.project}` : `/projects/${getPostSlug(post)}`;
    case 'radio':
      return `/interests/radio/${getPostSlug(post)}`;
    case 'writing':
      return `/writing/${getPostSlug(post)}`;
  }
}
