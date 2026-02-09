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
        <header className="fixed top-0 left-56 right-0 h-14 bg-white border-b border-[#E8E3DB] z-30">
            <div className="h-full px-6 flex items-center justify-between">
                {/* Organization name */}
                <div>
                    <h2 className="font-medium text-[#3D3835]">{organization.name}</h2>
                </div>

                {/* User menu */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="flex items-center gap-2 text-[#6B6560] hover:text-[#3D3835] hover:bg-[#F5F0E8]"
                        >
                            <Avatar className="h-7 w-7">
                                <AvatarFallback className="bg-[#C77B58] text-white text-xs">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{user.full_name}</span>
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="w-56 bg-white border-[#E8E3DB]"
                    >
                        <DropdownMenuLabel className="text-[#3D3835]">
                            <div className="flex flex-col">
                                <span>{user.full_name}</span>
                                <span className="text-xs font-normal text-[#7A756F]">{user.email}</span>
                                <span className="text-xs font-normal text-[#C77B58] mt-1">{roleLabel}</span>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-[#E8E3DB]" />
                        <DropdownMenuItem
                            className="text-[#6B6560] hover:text-[#3D3835] hover:bg-[#F5F0E8] cursor-pointer"
                        >
                            <UserIcon className="mr-2 h-4 w-4" />
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-[#E8E3DB]" />
                        <DropdownMenuItem
                            onClick={handleSignOut}
                            className="text-[#D4574E] hover:text-[#C74840] hover:bg-red-50 cursor-pointer"
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
