'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User, Organization } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { LogOut, User as UserIcon, ChevronDown } from 'lucide-react';

interface HeaderProps {
    user: User;
    organization: Organization;
}

export function Header({ user, organization }: HeaderProps) {
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            toast.error('Failed to sign out');
            return;
        }
        router.push('/login');
        router.refresh();
    };

    const initials = user.full_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const roleLabel = user.role.charAt(0).toUpperCase() + user.role.slice(1);

    return (
        <header className="fixed top-0 left-56 right-0 h-14 bg-background border-b border-border z-30">
            <div className="h-full px-6 flex items-center justify-between">
                {/* Organization name */}
                <div>
                    <h2 className="font-medium text-foreground">{organization.name}</h2>
                </div>

                {/* User menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted"
                        >
                            <Avatar className="h-7 w-7">
                                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{user.full_name}</span>
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="w-56 bg-card border-border"
                    >
                        <DropdownMenuLabel className="text-foreground">
                            <div className="flex flex-col">
                                <span>{user.full_name}</span>
                                <span className="text-xs font-normal text-muted-foreground">{user.email}</span>
                                <span className="text-xs font-normal text-primary mt-1">{roleLabel}</span>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-border" />
                        <DropdownMenuItem
                            className="text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                        >
                            <UserIcon className="mr-2 h-4 w-4" />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border" />
                        <DropdownMenuItem
                            onClick={handleSignOut}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
