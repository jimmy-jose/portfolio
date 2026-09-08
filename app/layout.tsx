import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Jimmy Jose | Senior Software Engineer',
  description:
    '10 years building production software. Explore Jimmy Jose’s work across backend systems, full stack, mobile, cloud and AI through an interactive terminal.',
  icons: { icon: '/icon.svg' },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
