import { Geist, Geist_Mono, Pacifico } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import Navbar from "./components/Navbar";
import { APP_NAME, APP_DOMAIN } from "./config";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pacifico = Pacifico({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-pacifico',
})

export const metadata = {
  title: `${APP_NAME} | Discover Top & Trending Podcasts`,
  description: `${APP_NAME} helps you explore and listen to trending, top-rated, and newly released podcasts across various genres. Your modern hub for podcast discovery and streaming.`,

  alternates: {
    canonical: APP_DOMAIN,
  },

  openGraph: {
    title: `${APP_NAME} | Discover Top & Trending Podcasts`,
    description: `${APP_NAME} is your go-to platform to explore trending, new, and top-rated podcasts across genres. Stream, discover, and stay updated.`,
    url: APP_DOMAIN,
    siteName: APP_NAME,
    type: 'website',
    locale: 'en_US',
  },

  twitter: {
    card: 'summary_large_image',
    title: `${APP_NAME} | Discover Top & Trending Podcasts`,
    description: `${APP_NAME} lets you stream, discover, and stay updated with the best podcasts online.`,
  },

  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <Suspense>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} antialiased
        bg-gradient-to-br
        from-gray-400 via-gray-200 to-gray-500
        dark:from-gray-900 dark:via-gray-700 dark:to-black
        text-gray-950 dark:text-gray-200 bg-opacity-90 bg-fixed
        transition-colors duration-500 ease-in-out`}
        >
          <ThemeProvider attribute="data-theme" enableSystem>
            <div className="flex flex-col min-h-screen">
              <Navbar />

              <main className="flex-1 px-4 sm:px-6 md:px-10 py-20">
                {children}
              </main>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </Suspense>
  );
}
