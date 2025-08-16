'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Landmark, 
  Users, 
  LogOut,
  PanelLeftClose, 
  PanelRightClose 
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/pemda', icon: Landmark, label: 'Pemda' },
  { href: '/opd', icon: Users, label: 'OPD' },
  { href: '/logout', icon: LogOut, label: 'Logout' },
];

const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void; }) => {
  const pathname = usePathname();

  return (
    <aside
      className={`min-h-full bg-sidebar-bg text-sidebar-text flex flex-col transition-all duration-300
        ${isOpen ? 'w-64' : 'w-20'}
        md:relative md:translate-x-0 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        fixed md:static z-40 h-full`}
    >
      <div className="flex-1 p-4">
        <div className="flex items-center justify-center mb-8 relative h-14">
          {isOpen && (
            <Image
              src="/logo-mahakam-ulu.svg"
              alt="Logo Mahakam Ulu"
              width={55}
              height={55}
              className="transition-opacity duration-300"
            />
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-400 hover:text-white absolute right-0"
          >
            {isOpen ? <PanelLeftClose /> : <PanelRightClose />}
          </button>
        </div>

        {isOpen && (
          <div className="text-center mb-8">
            <h1 className="font-bold text-[15px] leading-tight">KINERJA PEMBANGUNAN DAERAH</h1>
            <p className="text-[15px]">Kabupaten Mahakam Ulu</p>
          </div>
        )}
        
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
                        : 'hover:bg-white/20'
                    } ${!isOpen && 'justify-center'}`}
                  >
                    <item.icon size={20} className={isLogout ? 'text-red-400' : ''} />
                    <span className={!isOpen ? 'hidden' : 'block'}>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;