'use client';
import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/Providers';
import MainLayout from '@/components/MainLayout';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}
