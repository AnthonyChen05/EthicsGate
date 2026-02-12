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
        <aside className="fixed left-0 top-0 h-full w-56 bg-background border-r border-border z-40">
            {/* Logo */}
            <div className="h-14 flex items-center px-4 border-b border-border">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-primary" />
                    <span className="font-semibold text-foreground">EthicsGate</span>
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
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Help section */}
            <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border">
                <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-foreground mb-1">
                        <BookOpen className="h-4 w-4" />
                        <span className="text-sm font-medium">Need help?</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Check our guides for tips on ethics submissions.
                    </p>
                </div>
            </div>
        </aside>
    );
}
