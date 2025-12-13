import type {Metadata} from 'next';
import {Geist} from 'next/font/google';
import Script from 'next/script';
import './globals.css';

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
      suppressHydrationWarning
    >
    <head>
      <Script
        id="theme-init"
        strategy="beforeInteractive"
      >
        {`
          (function() {
            try {
              var mql = window.matchMedia('(prefers-color-scheme: dark)');
              var setTheme = function(isDark) {
                document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
              };
              setTheme(mql.matches);
              // Listen for OS theme changes
              if (typeof mql.addEventListener === 'function') {
                mql.addEventListener('change', function(e) { setTheme(e.matches); });
              } else if (typeof mql.addListener === 'function') {
                // Safari
                mql.addListener(function(e) { setTheme(e.matches); });
              }
            } catch (e) {
              // noop
            }
          })();
        `}
      </Script>
    </head>
    <body
      className={`${geistSans.variable} antialiased`}
    >
    {children}
    </body>
    </html>
  );
}