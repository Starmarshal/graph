import type {Metadata} from 'next';
import {Geist} from 'next/font/google';
import '@/app/globals.css';

const geistSans = Geist({
  display: 'swap',
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    template: '%s Graph Visualiser',
    default: ''
  },
  description: 'Site for graph visualisation',
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html
        lang="en"
        className="antialiased theme-light"
      >
      <body
        className={`${geistSans.variable} antialiased`}
      >
      {children}
      </body>
      </html>
  );
}
