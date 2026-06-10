import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getPostSlug } from '../../lib/posts';

interface OgProps {
  title: string;
  description: string;
  section: string;
  thumbnail?: string;
}

export async function getStaticPaths() {
  const [projects, interests, posts] = await Promise.all([
    getCollection('projects'),
    getCollection('interests'),
    getCollection('posts'),
  ]);

  const staticPages = [
    {
      params: { slug: 'home' },
      props: { title: 'Jonathan Jackson', description: 'Staff Software Engineer at LinkedIn. Amateur radio operator and builder of things.', section: '' } satisfies OgProps,
    },
    {
      params: { slug: 'resume' },
      props: { title: 'Resume', description: 'Professional background and experience.', section: '' } satisfies OgProps,
    },
    {
      params: { slug: 'projects' },
      props: { title: 'Projects', description: "Things I've built.", section: '' } satisfies OgProps,
    },
    {
      params: { slug: 'posts' },
      props: { title: 'Posts', description: 'All posts across projects, radio, and writing.', section: '' } satisfies OgProps,
    },
    {
      params: { slug: 'interests' },
      props: { title: 'Interests', description: "Things I'm into.", section: '' } satisfies OgProps,
    },
    {
      params: { slug: 'interests-dogs' },
      props: { title: 'Furry Friends', description: 'Dogs past and present.', section: 'Interests' } satisfies OgProps,
    },
    {
      params: { slug: 'interests-reading' },
      props: { title: 'Reading', description: "Books I'm reading and have read.", section: 'Interests' } satisfies OgProps,
    },
  ];

  const projectPages = projects.map(p => ({
    params: { slug: `project-${p.id}` },
    props: { title: p.data.title, description: p.data.summary ?? '', section: 'Projects', thumbnail: p.data.thumbnail } satisfies OgProps,
  }));

  const interestPages = interests.map(i => ({
    params: { slug: `interest-${i.id}` },
    props: { title: i.data.title, description: i.data.description ?? '', section: 'Interests', thumbnail: i.data.thumbnail } satisfies OgProps,
  }));

  const postPages = posts
    .filter(p => !p.data.draft)
    .map(p => ({
      params: { slug: `post-${getPostSlug(p)}` },
      props: {
        title: p.data.title,
        description: p.data.summary ?? '',
        section: p.data.interest
          ? p.data.interest.charAt(0).toUpperCase() + p.data.interest.slice(1)
          : 'Projects',
        thumbnail: p.data.thumbnail,
      } satisfies OgProps,
    }));

  return [...staticPages, ...projectPages, ...interestPages, ...postPages];
}

// Read fonts once at module load (build-time only)
// satori requires woff (not woff2) format
const fontRegular = readFileSync(
  join(process.cwd(), 'node_modules/@fontsource/inter/files/inter-latin-400-normal.woff')
);
const fontBold = readFileSync(
  join(process.cwd(), 'node_modules/@fontsource/inter/files/inter-latin-700-normal.woff')
);

function key(accent = false): object {
  return {
    type: 'div',
    props: {
      style: {
        width: 22,
        height: 22,
        backgroundColor: accent ? '#3b82f6' : '#334155',
        borderRadius: 4,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: accent ? '#60a5fa' : '#475569',
      },
    },
  };
}

function keyRow(keys: object[]): object {
  return { type: 'div', props: { style: { display: 'flex', gap: 4 }, children: keys } };
}

const spacebarKey: object = {
  type: 'div',
  props: {
    style: {
      width: 62,
      height: 22,
      backgroundColor: '#1e40af',
      borderRadius: 4,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: '#3b82f6',
    },
  },
};

const keyboardIcon: object = {
  type: 'div',
  props: {
    style: { display: 'flex', flexDirection: 'column', gap: 5 },
    children: [
      keyRow([key(), key(), key(true), key(), key()]),
      keyRow([key(), key(), key(), key(), key()]),
      keyRow([spacebarKey, key()]),
    ],
  },
};

function buildOgElement(props: OgProps, thumbnailDataUri: string | undefined): object {
  const { title, description, section } = props;

  const domainLabel: object = {
    type: 'div',
    props: {
      style: { color: '#475569', fontSize: 11, fontFamily: 'Inter', letterSpacing: 2 },
      children: 'JONATHANJACKSON.DEV',
    },
  };

  const leftChildren: object[] = thumbnailDataUri
    ? [
        {
          type: 'img',
          props: {
            src: thumbnailDataUri,
            style: { position: 'absolute', top: 0, left: 0, width: 380, height: 630, objectFit: 'cover' },
          },
        },
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              padding: '8px 12px',
              backgroundColor: 'rgba(0,0,0,0.65)',
            },
            children: [
              {
                type: 'span',
                props: {
                  style: { color: '#94a3b8', fontSize: 11, fontFamily: 'Inter', letterSpacing: 2 },
                  children: 'JONATHANJACKSON.DEV',
                },
              },
            ],
          },
        },
      ]
    : [
        keyboardIcon,
        { type: 'div', props: { style: { display: 'flex', marginTop: 20 }, children: [domainLabel] } },
      ];

  const rightChildren: object[] = [];

  if (section) {
    rightChildren.push({
      type: 'div',
      props: {
        style: {
          color: '#64748b',
          fontSize: 13,
          fontFamily: 'Inter',
          fontWeight: 400,
          letterSpacing: 3,
          marginBottom: 16,
        },
        children: section.toUpperCase(),
      },
    });
  }

  rightChildren.push({
    type: 'div',
    props: {
      style: {
        color: '#f1f5f9',
        fontSize: title.length > 30 ? 40 : 52,
        fontFamily: 'Inter',
        fontWeight: 700,
        lineHeight: 1.1,
        marginBottom: 20,
      },
      children: title,
    },
  });

  const truncatedDesc = description.length > 100 ? description.slice(0, 97) + '...' : description;
  if (truncatedDesc) {
    rightChildren.push({
      type: 'div',
      props: {
        style: { color: '#94a3b8', fontSize: 22, fontFamily: 'Inter', fontWeight: 400, lineHeight: 1.4 },
        children: truncatedDesc,
      },
    });
  }

  return {
    type: 'div',
    props: {
      style: { display: 'flex', width: 1200, height: 630, backgroundColor: '#0f172a' },
      children: [
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: 380,
              height: 630,
              backgroundColor: '#1e293b',
              borderRightWidth: 1,
              borderRightStyle: 'solid',
              borderRightColor: '#334155',
              position: 'relative',
              overflow: 'hidden',
            },
            children: leftChildren,
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              flexGrow: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '60px 56px',
            },
            children: rightChildren,
          },
        },
      ],
    },
  };
}

export const GET: APIRoute = async ({ props }) => {
  const ogProps = props as OgProps;

  let thumbnailDataUri: string | undefined;
  if (ogProps.thumbnail) {
    const imgBuffer = readFileSync(join(process.cwd(), 'public', ogProps.thumbnail));
    const ext = ogProps.thumbnail.split('.').pop()?.toLowerCase() ?? 'jpg';
    const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
    thumbnailDataUri = `data:${mime};base64,${imgBuffer.toString('base64')}`;
  }

  const element = buildOgElement(ogProps, thumbnailDataUri);

  const svg = await satori(element as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Inter', data: fontRegular, weight: 400, style: 'normal' },
      { name: 'Inter', data: fontBold, weight: 700, style: 'normal' },
    ],
  });

  const png = await sharp(Buffer.from(svg)).png().toBuffer();

  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' },
  });
};
