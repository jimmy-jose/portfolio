import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const alt =
  'Selected work and client references by Jimmy Jose, independent software engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpenGraphImage() {
  const [editorial, sans] = await Promise.all([
    readFile(
      join(process.cwd(), 'public/references/fonts/eb-garamond-regular.ttf'),
    ),
    readFile(join(process.cwd(), 'public/references/fonts/geist-regular.ttf')),
  ]);
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        padding: '56px 70px',
        background: '#f7f8f4',
        color: '#202b26',
        fontFamily: 'Geist',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          borderBottom: '1px solid #d7ddd3',
          paddingBottom: 25,
          fontSize: 22,
        }}
      >
        <span>Jimmy Jose</span>
        <span style={{ color: '#5e685f', fontSize: 18 }}>
          Independent software engineer
        </span>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: 58,
          fontFamily: 'Editorial',
          fontSize: 84,
          lineHeight: 1.05,
          letterSpacing: '-2px',
        }}
      >
        <span>Selected work &amp;</span>
        <span style={{ color: '#294d38' }}>client references.</span>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 'auto',
          paddingTop: 28,
          borderTop: '1px solid #d7ddd3',
          fontSize: 18,
          color: '#5e685f',
        }}
      >
        <span>JDA practice management / Thekken local discovery</span>
        <span>jimmyj.is-a.dev</span>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Editorial', data: editorial, weight: 400, style: 'normal' },
        { name: 'Geist', data: sans, weight: 400, style: 'normal' },
      ],
    },
  );
}
