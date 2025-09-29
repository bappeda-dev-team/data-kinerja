'use client';

import { useState } from 'react'; // Import useState
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
    Building2,      // <-- Added for OPD icon
    ChevronDown,    // <-- Added for dropdown indicator
} from 'lucide-react';

// Define a type for navigation items, including optional sub-items
type NavItem = {
    href: string;
    icon: React.ElementType;
    label: string;
    subItems?: NavItem[]; // Optional array for sub-menus
};

// 1. Updated navItems structure
const navItems: NavItem[] = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    {
        href: '/dataMaster', // Parent href
        icon: DatabaseIcon,
        label: 'Data Master',
        subItems: [
            { href: '/dataMaster/masterOpd', icon: Building2, label: 'Master OPD' },
            { href: '/dataMaster/masterUser', icon: Building2, label: 'Master User' },
            { href: '/dataMaster/masterPeriode', icon: Building2, label: 'Master Periode' }
            // You can add more sub-items here in the future
        ]
    },
    { href: '/pemda', icon: Landmark, label: 'Pemda' },
    { href: '/opd', icon: Users, label: 'OPD' },
    { href: '/logout', icon: LogOut, label: 'Logout' },
];

const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void; }) => {
    const pathname = usePathname();
    // 2. State to manage open/closed state of dropdowns
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    const handleMenuClick = (href: string) => {
        // Toggle the state for the clicked menu
        setOpenMenus(prevState => ({ ...prevState, [href]: !prevState[href] }));
    };

    return (
        <aside
            className={`min-h-full bg-sidebar-bg text-sidebar-text flex flex-col transition-all duration-300
                ${isOpen ? 'w-64' : 'w-20'}
                md:relative md:translate-x-0 
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                fixed md:static z-40 h-full`}
        >
            <div className="flex-1 p-4">
                {/* ... your existing header and logo code ... */}
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
                        {/* 3. New Rendering Logic */}
                        {navItems.map((item) => {
                            const isParentActive = item.subItems ? pathname.startsWith(item.href) : pathname === item.href;
                            const isLogout = item.label === 'Logout';

                            // If item has sub-items, render a dropdown
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
                                        {/* Conditionally render sub-menu */}
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
                                                                } ${!isOpen && 'justify-center'}`}
                                                            >
                                                                {/* You can add icons to sub-items too */}
                                                                <span className={!isOpen ? 'hidden' : 'block'}>{subItem.label}</span>
                                                            </Link>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </li>
                                );
                            }
                            
                            // Otherwise, render a regular link
                            return (
                                <li key={item.label}>
                                    <Link
                                        href={item.href}
                                        className={`flex items-center gap-3 p-3 my-1 rounded-md transition-colors ${
                                            isParentActive ? 'bg-sidebar-active-bg text-sidebar-active-text font-bold' : 'hover:bg-white/20'
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