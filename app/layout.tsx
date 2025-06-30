import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/layout/Header';
import MobileNavbar from '@/components/layout/MobileNavbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GVP Reporting System',
  description: 'Report garbage vulnerable points to keep our community clean',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="pt-16 pb-16 md:pb-0">
          {children}
        </main>
        <MobileNavbar />
        
        {/* Bolt Badge - Fixed position bottom left */}
        <a
          href="https://bolt.new/"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed top-4 right-4 z-50 hover:scale-110 transition-transform duration-200 ease-in-out"
          aria-label="Built with Bolt"
        >
          <img
            src="https://raw.githubusercontent.com/kickiniteasy/bolt-hackathon-badge/main/src/public/bolt-badge/black_circle_360x360/black_circle_360x360.png"
            alt="Built with Bolt"
            className="w-20 h-20 md:w-20 md:h-20 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"
          />
        </a>
      </body>
    </html>
  );
}