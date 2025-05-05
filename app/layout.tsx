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
      </body>
    </html>
  );
}