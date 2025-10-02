'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { 
    Home, 
    Landmark, 
    Users, 
    LogOut,
    PanelLeftClose, 
    PanelRightClose, 
    DatabaseIcon,
    Building2,
    ChevronDown, 
} from 'lucide-react';
import { logout } from '../lib/Cookie';

// Tipe untuk setiap item navigasi, bisa memiliki sub-item (opsional)
type NavItem = {
    href: string;
    icon: React.ElementType;
    label: string;
    subItems?: NavItem[]; // Array opsional untuk sub-menu
    action?: () => void; // Aksi opsional, misalnya untuk logout
};

// Struktur data untuk semua item navigasi
const navItems: NavItem[] = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    {
        href: '/dataMaster',
        icon: DatabaseIcon,
        label: 'Data Master',
        subItems: [
            { href: '/dataMaster/masterOpd', icon: Building2, label: 'Master OPD' },
            { href: '/dataMaster/masterUser', icon: Building2, label: 'Master User' },
            { href: '/dataMaster/masterPeriode', icon: Building2, label: 'Master Periode' }
        ]
    },
    { href: '/pemda', icon: Landmark, label: 'Pemda' },
    { href: '/opd', icon: Users, label: 'OPD' },
    { href: '/logout', icon: LogOut, label: 'Logout', action: logout }, // Tombol logout dengan aksi
];

const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void; }) => {
    const pathname = usePathname();
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    // Fungsi untuk menangani klik pada menu dropdown
    const handleMenuClick = (href: string) => {
        setOpenMenus(prevState => ({ ...prevState, [href]: !prevState[href] }));
    };

    const renderNavItems = () => {
        return navItems.map((item) => {
            const isParentActive = item.subItems 
                ? pathname.startsWith(item.href) 
                : pathname === item.href;
            
            // Jika item adalah menu dropdown (memiliki subItems)
            if (item.subItems) {
                return (
                    <li key={item.label}>
                        <button
                            onClick={() => handleMenuClick(item.href)}
                            className={`w-full flex items-center justify-between gap-3 p-3 my-1 rounded-md transition-colors ${
                                isParentActive ? 'bg-sidebar-active-bg text-sidebar-active-text font-bold' : 'hover:bg-white/20'
                            } ${!isOpen && 'justify-center'}`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon size={20} />
                                <span className={!isOpen ? 'hidden' : 'block'}>{item.label}</span>
                            </div>
                            {isOpen && (
                                <ChevronDown size={16} className={`transition-transform ${openMenus[item.href] ? 'rotate-180' : ''}`} />
                            )}
                        </button>
                        {isOpen && openMenus[item.href] && (
                            <ul className="pl-6 mt-1">
                                {item.subItems.map((subItem) => {
                                    const isSubItemActive = pathname.startsWith(subItem.href);
                                    return (
                                        <li key={subItem.label}>
                                            <Link
                                                href={subItem.href}
                                                className={`flex items-center gap-3 p-2 my-1 rounded-md transition-colors text-sm ${
                                                    isSubItemActive ? 'bg-sidebar-active-bg text-sidebar-active-text font-semibold' : 'hover:bg-white/20'
                                                }`}
                                            >
                                                <span>{subItem.label}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </li>
                );
            }

            // Jika item adalah link biasa atau tombol aksi (seperti logout)
            const commonClasses = `flex items-center gap-3 p-3 my-1 rounded-md transition-colors ${
                isParentActive ? 'bg-sidebar-active-bg text-sidebar-active-text font-bold' : 'hover:bg-white/20'
            } ${!isOpen && 'justify-center'}`;

            return (
                <li key={item.label}>
                    {item.action ? (
  <button
    onClick={(e) => { e.preventDefault(); item.action?.(); }}
    className={`w-full ${commonClasses}`}
  >
    <item.icon size={20} className={item.label === 'Logout' ? 'text-red-400' : ''} />
    <span className={!isOpen ? 'hidden' : 'block'}>{item.label}</span>
  </button>
) : (
  <Link href={item.href} className={commonClasses}>
    <item.icon size={20} />
    <span className={!isOpen ? 'hidden' : 'block'}>{item.label}</span>
  </Link>
)}

                </li>
            );
        });
    };

    return (
        <aside
            className={`min-h-full bg-sidebar-bg text-sidebar-text flex flex-col transition-all duration-300
                ${isOpen ? 'w-64' : 'w-20'}
                fixed md:static z-40 h-full md:translate-x-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
            <div className="flex-1 p-4">
                {/* Header dan Logo */}
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

                {/* Judul Aplikasi */}
                {isOpen && (
                    <div className="text-center mb-8">
                        <h1 className="font-bold text-[15px] leading-tight">KINERJA PEMBANGUNAN DAERAH</h1>
                        <p className="text-[15px]">Kabupaten Mahakam Ulu</p>
                    </div>
                )}
                
                {/* Navigasi */}
                <nav>
                    <ul>
                        {renderNavItems()}
                    </ul>
                </nav>
            </div>
        </aside>
    );
};

export default Sidebar;