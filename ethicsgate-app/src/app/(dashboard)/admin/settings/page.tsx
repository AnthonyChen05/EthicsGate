import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default async function AdminSettingsPage() {
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

    // Fetch organization
    const { data: organization } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', user.organization_id)
        .single();

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-3xl font-bold text-white">Organization Settings</h1>
                <p className="text-zinc-400 mt-1">
                    Configure your organization&apos;s settings
                </p>
            </div>

            <Card className="bg-zinc-800/50 border-zinc-700">
                <CardHeader>
                    <CardTitle className="text-white">General</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Basic organization information
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="org-name" className="text-zinc-300">Organization Name</Label>
                        <Input
                            id="org-name"
                            defaultValue={organization?.name}
                            className="bg-zinc-900 border-zinc-600 text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="org-slug" className="text-zinc-300">URL Slug</Label>
                        <div className="flex items-center gap-2">
                            <span className="text-zinc-500 text-sm">ethicsgate.com/</span>
                            <Input
                                id="org-slug"
                                defaultValue={organization?.slug}
                                disabled
                                className="bg-zinc-900 border-zinc-600 text-zinc-500 flex-1"
                            />
                        </div>
                        <p className="text-xs text-zinc-500">URL slug cannot be changed after creation</p>
                    </div>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                        Save Changes
                    </Button>
                </CardContent>
            </Card>

            <Card className="bg-zinc-800/50 border-zinc-700">
                <CardHeader>
                    <CardTitle className="text-white">Review Settings</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Configure the review process
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-zinc-400 text-sm">
                        Advanced review settings will be available in Phase 4.
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-zinc-800/50 border-zinc-700">
                <CardHeader>
                    <CardTitle className="text-white">Branding</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Customize your organization&apos;s appearance
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-zinc-400 text-sm">
                        Custom branding options will be available in Phase 4.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
