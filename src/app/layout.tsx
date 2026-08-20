import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Northwind Supply Co. | Store',
  description: 'A small Next.js storefront running on a persistent Node server.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
