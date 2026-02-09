'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/types/database';
import {
    LayoutDashboard,
    FileText,
    Users,
    Settings,
    GraduationCap,
    BookOpen,
} from 'lucide-react';

interface SidebarProps {
    userRole: UserRole;
}

export function Sidebar({ userRole }: SidebarProps) {
    const pathname = usePathname();

    const navigation = [
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: LayoutDashboard,
            roles: ['admin', 'reviewer', 'researcher'],
        },
        {
            name: 'Proposals',
            href: '/proposals',
            icon: FileText,
            roles: ['admin', 'reviewer', 'researcher'],
        },
        {
            name: 'Team',
            href: '/admin/users',
            icon: Users,
            roles: ['admin'],
        },
        {
            name: 'Settings',
            href: '/admin/settings',
            icon: Settings,
            roles: ['admin'],
        },
    ];

    const filteredNav = navigation.filter(item =>
        item.roles.includes(userRole)
    );

    return (
        <aside className="fixed left-0 top-0 h-full w-56 bg-white border-r border-[#E8E3DB] z-40">
            {/* Logo */}
            <div className="h-14 flex items-center px-4 border-b border-[#E8E3DB]">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-[#C77B58]" />
                    <span className="font-semibold text-[#3D3835]">EthicsGate</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="p-3 space-y-1">
                {filteredNav.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-[#FDF8F4] text-[#C77B58]'
                                    : 'text-[#6B6560] hover:bg-[#F5F0E8] hover:text-[#3D3835]'
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Help section */}
            <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-[#E8E3DB]">
                <div className="bg-[#FDF8F4] rounded-lg p-3">
                    <div className="flex items-center gap-2 text-[#C77B58] mb-1">
                        <BookOpen className="h-4 w-4" />
                        <span className="text-sm font-medium">Need help?</span>
                    </div>
                    <p className="text-xs text-[#7A756F]">
                        Check our guides for tips on ethics submissions.
                    </p>
                </div>
            </div>
        </aside>
    );
}
