// src/app/layout.tsx (UPDATED)
'use client'; 

import { useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import './globals.css';

import Sidebar from '../app/components/layout/Sidebar';
import { Menu } from 'lucide-react';

import { Poppins } from 'next/font/google';
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});


export default function RootLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const noLayoutRoutes = ['/login']; 
  const showLayout = !noLayoutRoutes.includes(pathname);

  if (!showLayout) {
    return (
      <html lang="id">
        <body className={poppins.className}>{children}</body>
      </html>
    );
  }

  return (
    <html lang="id">
      <head>
        <title>Kinerja Pembangunan Daerah</title>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${poppins.className} bg-content-bg`}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />

          <div className="flex-1 flex flex-col overflow-y-auto">
            <header className="bg-white p-4 flex items-center md:hidden sticky top-0 z-30 shadow-sm">
              <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
                <Menu size={24} />
              </button>
            </header>
            
            <main className="p-4 md:p-6 lg:p-8 flex-1">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}