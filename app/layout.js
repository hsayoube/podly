import { Geist, Geist_Mono, Pacifico } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import { APP_NAME } from "./config";
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
  title: APP_NAME,
  description: `Discover trending podcasts with ${APP_NAME} — your modern podcast discovery hub.`,
};

export default function RootLayout({ children }) {
  return (
    <Suspense>
      <html lang="en" className="scroll-smooth">
        <body
          className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} antialiased
        bg-gradient-to-br
        from-gray-400 via-gray-200 to-gray-500
        dark:from-gray-900 dark:via-gray-700 dark:to-black
        text-gray-950 dark:text-gray-200 bg-opacity-90 bg-fixed
        transition-colors duration-500 ease-in-out`}
        >
          <ThemeProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />

              <main className="flex-1 px-4 sm:px-6 md:px-10 py-20">
                {children}
              </main>

              {/* Optional: Add a Footer if needed */}
              {/* <Footer /> */}
            </div>
          </ThemeProvider>
        </body>
      </html>
    </Suspense>
  );
}
