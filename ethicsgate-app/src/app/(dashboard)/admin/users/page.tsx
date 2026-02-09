import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { UserManagementClient } from './user-management-client';

export default async function AdminUsersPage() {
    const supabase = await createClient();

    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) redirect('/login');

    const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

    if (!user || user.role !== 'admin') {
        redirect('/dashboard');
    }

    // Fetch all users in organization
    const { data: users } = await supabase
        .from('users')
        .select('*')
        .eq('organization_id', user.organization_id)
        .order('created_at', { ascending: false });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">User Management</h1>
                <p className="text-zinc-400 mt-1">
                    Manage users and roles in your organization
                </p>
            </div>

            <UserManagementClient
                users={users || []}
                currentUserId={user.id}
                organizationId={user.organization_id}
            />
        </div>
    );
}
