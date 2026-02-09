import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ProposalCard } from '@/components/proposals/proposal-card';
import {
    FileText,
    Clock,
    CheckCircle,
    AlertCircle,
    Plus,
    ArrowRight,
} from 'lucide-react';

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) redirect('/login');

    const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

    if (!user) redirect('/login');

    // Fetch relevant proposals based on role
    let proposalsQuery = supabase
        .from('proposals')
        .select('*, author:users!submitted_by(*)')
        .eq('organization_id', user.organization_id)
        .order('updated_at', { ascending: false })
        .limit(5);

    // Researchers see only their own
    if (user.role === 'researcher') {
        proposalsQuery = proposalsQuery.eq('submitted_by', user.id);
    }

    const { data: proposals } = await proposalsQuery;

    // Get stats for admin
    let stats = null;
    if (user.role === 'admin' || user.role === 'reviewer') {
        const { data: allProposals } = await supabase
            .from('proposals')
            .select('status')
            .eq('organization_id', user.organization_id);

        if (allProposals) {
            stats = {
                total: allProposals.length,
                pending: allProposals.filter(p => p.status === 'submitted').length,
                underReview: allProposals.filter(p => p.status === 'under_review').length,
                approved: allProposals.filter(p => p.status === 'approved').length,
            };
        }
    }

    const roleGreetings = {
        admin: 'Here\'s what\'s happening with your organization.',
        reviewer: 'Here are proposals awaiting your review.',
        researcher: 'Track your research proposals here.',
    };

    return (
        <div className="space-y-6">
            {/* Welcome */}
            <div>
                <h1 className="text-2xl font-semibold text-[#3D3835]">
                    Welcome, {user.full_name.split(' ')[0]}
                </h1>
                <p className="text-[#7A756F] mt-1">
                    {roleGreetings[user.role]}
                </p>
            </div>

            {/* Stats for admin/reviewer */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="bg-white border-[#E8E3DB]">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[#F5F0E8] flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-[#6B6560]" />
                                </div>
                                <div>
                                    <p className="text-2xl font-semibold text-[#3D3835]">{stats.total}</p>
                                    <p className="text-sm text-[#7A756F]">Total</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-[#E8E3DB]">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[#FEF3E0] flex items-center justify-center">
                                    <Clock className="h-5 w-5 text-[#D4A574]" />
                                </div>
                                <div>
                                    <p className="text-2xl font-semibold text-[#3D3835]">{stats.pending}</p>
                                    <p className="text-sm text-[#7A756F]">Pending</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-[#E8E3DB]">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[#E8F4F8] flex items-center justify-center">
                                    <AlertCircle className="h-5 w-5 text-[#5B9AA0]" />
                                </div>
                                <div>
                                    <p className="text-2xl font-semibold text-[#3D3835]">{stats.underReview}</p>
                                    <p className="text-sm text-[#7A756F]">In Review</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-[#E8E3DB]">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[#E8F5E9] flex items-center justify-center">
                                    <CheckCircle className="h-5 w-5 text-[#7A9E7E]" />
                                </div>
                                <div>
                                    <p className="text-2xl font-semibold text-[#3D3835]">{stats.approved}</p>
                                    <p className="text-sm text-[#7A756F]">Approved</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Quick action for researchers */}
            {user.role === 'researcher' && (
                <Card className="bg-[#FDF8F4] border-[#E8E3DB]">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div>
                            <h3 className="font-medium text-[#3D3835]">Ready to submit a new proposal?</h3>
                            <p className="text-sm text-[#7A756F] mt-1">
                                Start your ethics review submission with our guided form.
                            </p>
                        </div>
                        <Button asChild className="bg-[#C77B58] hover:bg-[#B06A48] text-white">
                            <Link href="/proposals/new">
                                <Plus className="mr-2 h-4 w-4" />
                                New Proposal
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Recent proposals */}
            <Card className="bg-white border-[#E8E3DB]">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-medium text-[#3D3835]">
                        Recent Proposals
                    </CardTitle>
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="text-[#C77B58] hover:text-[#B06A48] hover:bg-[#FDF8F4]"
                    >
                        <Link href="/proposals">
                            View all
                            <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    {proposals && proposals.length > 0 ? (
                        <div className="space-y-3">
                            {proposals.map((proposal: any) => (
                                <ProposalCard
                                    key={proposal.id}
                                    proposal={proposal}
                                    author={proposal.author}
                                    showAuthor={user.role !== 'researcher'}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <FileText className="h-10 w-10 text-[#E8E3DB] mx-auto mb-3" />
                            <p className="text-[#7A756F]">No proposals yet</p>
                            {user.role === 'researcher' && (
                                <Button asChild className="mt-3 bg-[#C77B58] hover:bg-[#B06A48] text-white">
                                    <Link href="/proposals/new">
                                        Create your first proposal
                                    </Link>
                                </Button>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
