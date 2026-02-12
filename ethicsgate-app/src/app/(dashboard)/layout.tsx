import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Toaster } from '@/components/ui/sonner';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const { data: { user: authUser } } = await supabase.auth.getUser();

    if (!authUser) {
        redirect('/login');
    }

    // Fetch user profile
    const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

    if (!user) {
        redirect('/login');
    }

    // Fetch organization
    const { data: organization } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', user.organization_id)
        .single();

    if (!organization) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-background">
            <Sidebar userRole={user.role} />
            <Header user={user} organization={organization} />
            <main className="pl-56 pt-14">
                <div className="p-6 max-w-6xl">
                    {children}
                </div>
            </main>
            <Toaster
                position="bottom-right"
            />
        </div>
    );
}
