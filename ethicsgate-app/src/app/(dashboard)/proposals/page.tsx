import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ProposalCard } from '@/components/proposals/proposal-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, AlertCircle } from 'lucide-react';

export default async function ProposalsPage({
    searchParams,
}: {
    searchParams: Promise<{ filter?: string }>;
}) {
    const supabase = await createClient();
    const params = await searchParams;

    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) redirect('/login');

    const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

    if (!user) redirect('/login');

    // Fetch all proposals based on role
    let proposalsQuery = supabase
        .from('proposals')
        .select('*')
        .eq('organization_id', user.organization_id)
        .order('updated_at', { ascending: false });

    if (user.role === 'researcher') {
        proposalsQuery = proposalsQuery.eq('submitted_by', user.id);
    } else if (user.role === 'reviewer' && params.filter === 'review') {
        proposalsQuery = proposalsQuery.contains('assigned_reviewers', [user.id]);
    }

    const { data: proposals } = await proposalsQuery;

    // Group by status
    const groupedProposals = {
        all: proposals || [],
        draft: proposals?.filter(p => p.status === 'draft') || [],
        submitted: proposals?.filter(p => p.status === 'submitted') || [],
        under_review: proposals?.filter(p => p.status === 'under_review') || [],
        approved: proposals?.filter(p => p.status === 'approved') || [],
        rejected: proposals?.filter(p => p.status === 'rejected' || p.status === 'revise_and_resubmit') || [],
    };

    const showNewButton = user.role === 'researcher' || user.role === 'admin';

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">
                        {user.role === 'reviewer' && params.filter === 'review'
                            ? 'Review Queue'
                            : 'Proposals'}
                    </h1>
                    <p className="text-zinc-400 mt-1">
                        {user.role === 'researcher' && 'Manage your research proposal submissions'}
                        {user.role === 'reviewer' && 'Review assigned proposals'}
                        {user.role === 'admin' && 'View and manage all proposals'}
                    </p>
                </div>

                {showNewButton && (
                    <Button
                        asChild
                        className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
                    >
                        <Link href="/proposals/new">
                            <Plus className="mr-2 h-4 w-4" />
                            New Proposal
                        </Link>
                    </Button>
                )}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="all" className="w-full">
                <TabsList className="bg-zinc-800 border border-zinc-700">
                    <TabsTrigger value="all" className="data-[state=active]:bg-zinc-700">
                        All ({groupedProposals.all.length})
                    </TabsTrigger>
                    {user.role !== 'reviewer' && (
                        <TabsTrigger value="draft" className="data-[state=active]:bg-zinc-700">
                            Drafts ({groupedProposals.draft.length})
                        </TabsTrigger>
                    )}
                    <TabsTrigger value="submitted" className="data-[state=active]:bg-zinc-700">
                        Submitted ({groupedProposals.submitted.length})
                    </TabsTrigger>
                    <TabsTrigger value="under_review" className="data-[state=active]:bg-zinc-700">
                        Under Review ({groupedProposals.under_review.length})
                    </TabsTrigger>
                    <TabsTrigger value="approved" className="data-[state=active]:bg-zinc-700">
                        Approved ({groupedProposals.approved.length})
                    </TabsTrigger>
                    <TabsTrigger value="rejected" className="data-[state=active]:bg-zinc-700">
                        Rejected ({groupedProposals.rejected.length})
                    </TabsTrigger>
                </TabsList>

                {Object.entries(groupedProposals).map(([key, proposalsList]) => (
                    <TabsContent key={key} value={key} className="mt-6">
                        {proposalsList.length > 0 ? (
                            <div className="grid gap-4">
                                {proposalsList.map((proposal) => (
                                    <ProposalCard
                                        key={proposal.id}
                                        proposal={proposal}
                                        showAuthor={user.role === 'admin'}
                                    />
                                ))}
                            </div>
                        ) : (
                            <Card className="bg-zinc-800/50 border-zinc-700">
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <AlertCircle className="h-12 w-12 text-zinc-600 mb-4" />
                                    <p className="text-zinc-400 text-center">
                                        No proposals found in this category.
                                    </p>
                                    {showNewButton && key === 'all' && (
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="mt-4 border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                                        >
                                            <Link href="/proposals/new">Create your first proposal</Link>
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
