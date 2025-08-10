// src/components/layout/Sidebar.tsx (Updated)
'use client'; 
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building, User, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

// ... (kode type NavItem dan const navItems tetap sama dari sebelumnya)
const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/pemda', icon: Building, label: 'Pemda' },
  { href: '/opd', icon: User, label: 'OPD' },
  { href: '/logout', icon: LogOut, label: 'Logout' },
];

const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  const pathname = usePathname();

  return (
    <aside className={`w-64 min-h-full bg-sidebar-bg text-sidebar-text flex flex-col transition-all duration-300
                     md:relative md:translate-x-0 
                     ${isOpen ? 'translate-x-0' : '-translate-x-full absolute z-40'}`}
    >
      <div className="flex-1 p-4">
        <div className="flex items-center gap-4 mb-8 px-2">
          <Image src="/logo-mahakam-ulu.svg" alt="Logo Mahakam Ulu" width={40} height={40} />
          <div>
            <h1 className="font-bold text-sm leading-tight">KINERJA PEMBANGUNAN DAERAH</h1>
            <p className="text-xs">Kabupaten Mahakam Ulu</p>
          </div>
        </div>
        <nav>
          <ul>
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const isLogout = item.label === 'Logout';

              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 p-3 my-1 rounded-md transition-colors ${
                      isActive
                        ? 'bg-sidebar-active-bg text-sidebar-active-text font-bold'
                        : 'hover:bg-blue-900'
                    } ${isLogout ? 'mt-8 text-red-400 hover:bg-red-900' : ''}`}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Ikon Toggle Bawah */}
      <div className="p-4 border-t border-gray-700">
        <button className="text-gray-400 hover:text-white w-full flex justify-start gap-2">
          <ChevronLeft size={20} />
          <ChevronRight size={20} />
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;