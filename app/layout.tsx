// src/app/layout.tsx (SATU-SATUNYA FILE LAYOUT)
'use client'; // WAJIB ADA, karena kita akan menggunakan hook

import { useState, ReactNode } from 'react';
import { usePathname } from 'next/navigation'; // Untuk mendeteksi URL saat ini
import './globals.css';

// --- Impor semua komponen yang kita butuhkan ---
import Sidebar from '../app/components/layout/Sidebar';
import PageHeader from '../app/components/layout/PageHeader';
import { Menu } from 'lucide-react';

// --- Impor Font (sesuaikan jika perlu) ---
import { Poppins } from 'next/font/google';
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});


export default function RootLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // --- LOGIKA PENTING ---
  // Tentukan di halaman mana saja layout TIDAK akan muncul
  // Contoh: halaman login, register, dll.
  const noLayoutRoutes = ['/login']; 
  const showLayout = !noLayoutRoutes.includes(pathname);

  // Jika halaman adalah salah satu dari noLayoutRoutes, tampilkan halaman saja tanpa layout
  if (!showLayout) {
    return (
      <html lang="id">
        <body className={poppins.className}>{children}</body>
      </html>
    );
  }

  // Jika bukan, tampilkan layout LENGKAP dengan Sidebar dan Navbar
  return (
    <html lang="id">
      <head>
        <title>Dashboard Kinerja</title>
      </head>
      <body className={`${poppins.className} bg-content-bg`}>
        <div className="flex h-screen overflow-hidden">
          {/* 1. SIDEBAR */}
          <Sidebar isOpen={isSidebarOpen} />

          {/* Area konten utama yang bisa di-scroll */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Header Mobile untuk Toggle */}
            <header className="bg-white p-4 flex items-center md:hidden sticky top-0 z-30 shadow-sm">
              <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
                <Menu size={24} />
              </button>
            </header>

            {/* 2. KONTEN HALAMAN (termasuk navbar/header filter) */}
            <main className="p-4 md:p-6 lg:p-8 flex-1">
              <PageHeader title="Dinas Kesehatan" />
              <div className="mt-[-1px]"> 
                {/* Trik kecil agar border menyatu */}
                {children}
              </div>
            </main>
          </div>

          {/* Overlay untuk menutup sidebar di mobile */}
          {isSidebarOpen && (
            <div
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            ></div>
          )}
        </div>
      </body>
    </html>
  );
}