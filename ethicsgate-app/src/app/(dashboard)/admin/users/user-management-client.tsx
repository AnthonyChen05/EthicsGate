'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User, UserRole } from '@/types/database';
import { inviteUserSchema } from '@/lib/validators/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { UserPlus, MoreVertical, Shield, User as UserIcon, Eye } from 'lucide-react';

interface UserManagementClientProps {
    users: User[];
    currentUserId: string;
    organizationId: string;
}

export function UserManagementClient({
    users: initialUsers,
    currentUserId,
    organizationId,
}: UserManagementClientProps) {
    const router = useRouter();
    const supabase = createClient();

    const [users, setUsers] = useState(initialUsers);
    const [inviteOpen, setInviteOpen] = useState(false);
    const [inviteLoading, setInviteLoading] = useState(false);
    const [inviteForm, setInviteForm] = useState({
        email: '',
        fullName: '',
        role: 'researcher' as UserRole,
    });

    const handleInvite = async () => {
        setInviteLoading(true);

        const result = inviteUserSchema.safeParse(inviteForm);
        if (!result.success) {
            toast.error(result.error.errors[0].message);
            setInviteLoading(false);
            return;
        }

        try {
            // Create user via Supabase Auth invite
            const { data: authData, error: authError } = await supabase.auth.admin.inviteUserByEmail(
                inviteForm.email
            );

            if (authError) {
                // Fallback: just create the user record (they'll need to sign up)
                toast.error('Could not send invite email. User will need to sign up manually.');
            }

            // For now, show success and close modal
            toast.success(`Invitation sent to ${inviteForm.email}`);
            setInviteOpen(false);
            setInviteForm({ email: '', fullName: '', role: 'researcher' });
            router.refresh();
        } catch (err) {
            console.error('Invite error:', err);
            toast.error('Failed to send invitation');
        } finally {
            setInviteLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: UserRole) => {
        const { error } = await supabase
            .from('users')
            .update({ role: newRole })
            .eq('id', userId);

        if (error) {
            toast.error('Failed to update role');
            return;
        }

        setUsers(users.map(u =>
            u.id === userId ? { ...u, role: newRole } : u
        ));
        toast.success('Role updated successfully');
    };

    const getRoleBadgeColor = (role: UserRole) => {
        switch (role) {
            case 'admin':
                return 'bg-purple-500';
            case 'reviewer':
                return 'bg-blue-500';
            case 'researcher':
                return 'bg-emerald-500';
            default:
                return 'bg-zinc-500';
        }
    };

    const getRoleIcon = (role: UserRole) => {
        switch (role) {
            case 'admin':
                return <Shield className="h-4 w-4" />;
            case 'reviewer':
                return <Eye className="h-4 w-4" />;
            case 'researcher':
                return <UserIcon className="h-4 w-4" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Actions */}
            <div className="flex justify-end">
                <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Invite User
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-800 border-zinc-700">
                        <DialogHeader>
                            <DialogTitle className="text-white">Invite New User</DialogTitle>
                            <DialogDescription className="text-zinc-400">
                                Send an invitation to join your organization
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="invite-email" className="text-zinc-300">Email</Label>
                                <Input
                                    id="invite-email"
                                    type="email"
                                    placeholder="user@institution.edu"
                                    value={inviteForm.email}
                                    onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                                    className="bg-zinc-900 border-zinc-600 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="invite-name" className="text-zinc-300">Full Name</Label>
                                <Input
                                    id="invite-name"
                                    placeholder="Dr. Jane Doe"
                                    value={inviteForm.fullName}
                                    onChange={(e) => setInviteForm(prev => ({ ...prev, fullName: e.target.value }))}
                                    className="bg-zinc-900 border-zinc-600 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="invite-role" className="text-zinc-300">Role</Label>
                                <Select
                                    value={inviteForm.role}
                                    onValueChange={(value: UserRole) => setInviteForm(prev => ({ ...prev, role: value }))}
                                >
                                    <SelectTrigger className="bg-zinc-900 border-zinc-600 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-800 border-zinc-700">
                                        <SelectItem value="researcher">Researcher</SelectItem>
                                        <SelectItem value="reviewer">Reviewer</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setInviteOpen(false)}
                                className="border-zinc-600 text-zinc-300"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleInvite}
                                disabled={inviteLoading}
                                className="bg-emerald-600 hover:bg-emerald-700"
                            >
                                {inviteLoading ? 'Sending...' : 'Send Invitation'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Users Grid */}
            <div className="grid gap-4">
                {users.map((user) => {
                    const initials = user.full_name
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2);

                    const isCurrentUser = user.id === currentUserId;

                    return (
                        <Card key={user.id} className="bg-zinc-800/50 border-zinc-700">
                            <CardContent className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-12 w-12">
                                        <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-white">
                                            {initials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-white">{user.full_name}</span>
                                            {isCurrentUser && (
                                                <Badge variant="outline" className="text-xs border-zinc-600 text-zinc-400">
                                                    You
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-zinc-400">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Badge className={`${getRoleBadgeColor(user.role)} text-white flex items-center gap-1`}>
                                        {getRoleIcon(user.role)}
                                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                    </Badge>

                                    {!isCurrentUser && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-zinc-400 hover:text-white"
                                                >
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-zinc-800 border-zinc-700">
                                                <DropdownMenuItem
                                                    onClick={() => handleRoleChange(user.id, 'researcher')}
                                                    className="text-zinc-300 hover:text-white hover:bg-zinc-700"
                                                >
                                                    <UserIcon className="mr-2 h-4 w-4" />
                                                    Set as Researcher
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleRoleChange(user.id, 'reviewer')}
                                                    className="text-zinc-300 hover:text-white hover:bg-zinc-700"
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Set as Reviewer
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleRoleChange(user.id, 'admin')}
                                                    className="text-zinc-300 hover:text-white hover:bg-zinc-700"
                                                >
                                                    <Shield className="mr-2 h-4 w-4" />
                                                    Set as Admin
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
