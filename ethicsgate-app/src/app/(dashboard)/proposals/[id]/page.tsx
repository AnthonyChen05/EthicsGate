import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { formatDateTime, getStatusLabel } from '@/lib/utils';
import { ProposalEditor } from '@/components/editor/proposal-editor';
import { StatusBadge } from '@/components/proposals/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, UserPlus, Clock } from 'lucide-react';

export default async function ProposalDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) redirect('/login');

    const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

    if (!user) redirect('/login');

    // Fetch proposal
    const { data: proposal, error } = await supabase
        .from('proposals')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !proposal) {
        notFound();
    }

    // Check access
    const canView =
        proposal.submitted_by === user.id ||
        proposal.assigned_reviewers.includes(user.id) ||
        user.role === 'admin';

    if (!canView) {
        redirect('/proposals');
    }

    // Fetch author
    const { data: author } = await supabase
        .from('users')
        .select('*')
        .eq('id', proposal.submitted_by)
        .single();

    // Fetch assigned reviewers
    const { data: reviewers } = await supabase
        .from('users')
        .select('*')
        .in('id', proposal.assigned_reviewers.length > 0 ? proposal.assigned_reviewers : ['00000000-0000-0000-0000-000000000000']);

    const canEdit = proposal.submitted_by === user.id && proposal.status === 'draft';
    const canReview = proposal.assigned_reviewers.includes(user.id) && proposal.status === 'under_review';
    const canAssignReviewers = user.role === 'admin' && proposal.status === 'submitted';

    const authorInitials = author?.full_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || '??';

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="text-zinc-400 hover:text-white mt-1"
                    >
                        <Link href="/proposals">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-bold text-white">{proposal.title}</h1>
                            <StatusBadge status={proposal.status} />
                        </div>
                        <div className="flex items-center gap-4 text-sm text-zinc-400">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-xs bg-zinc-700">
                                        {authorInitials}
                                    </AvatarFallback>
                                </Avatar>
                                <span>{author?.full_name || 'Unknown'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>
                                    {proposal.submitted_at
                                        ? `Submitted ${formatDateTime(proposal.submitted_at)}`
                                        : `Created ${formatDateTime(proposal.created_at)}`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {canEdit && (
                        <Button
                            asChild
                            variant="outline"
                            className="border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                        >
                            <Link href={`/proposals/${id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Draft
                            </Link>
                        </Button>
                    )}
                    {canReview && (
                        <Button
                            asChild
                            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600"
                        >
                            <Link href={`/proposals/${id}/review`}>
                                Start Review
                            </Link>
                        </Button>
                    )}
                    {canAssignReviewers && (
                        <Button
                            variant="outline"
                            className="border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                        >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Assign Reviewers
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid gap-6">
                {/* Status Timeline */}
                <Card className="bg-zinc-800/50 border-zinc-700">
                    <CardHeader>
                        <CardTitle className="text-white text-lg">Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            {['draft', 'submitted', 'under_review', 'approved'].map((status, i) => {
                                const statusOrder = ['draft', 'submitted', 'under_review', 'approved'];
                                const currentIndex = statusOrder.indexOf(proposal.status);
                                const isComplete = i <= currentIndex;
                                const isCurrent = status === proposal.status;

                                return (
                                    <div key={status} className="flex items-center gap-2 flex-1">
                                        <div
                                            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${isComplete
                                                    ? 'bg-emerald-500 text-white'
                                                    : 'bg-zinc-700 text-zinc-400'
                                                } ${isCurrent ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-zinc-800' : ''}`}
                                        >
                                            {i + 1}
                                        </div>
                                        <span className={`text-sm ${isComplete ? 'text-white' : 'text-zinc-500'}`}>
                                            {getStatusLabel(status)}
                                        </span>
                                        {i < 3 && (
                                            <div className={`flex-1 h-0.5 ${isComplete && i < currentIndex ? 'bg-emerald-500' : 'bg-zinc-700'}`} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Assigned Reviewers */}
                {(user.role === 'admin' || proposal.submitted_by === user.id) && proposal.assigned_reviewers.length > 0 && (
                    <Card className="bg-zinc-800/50 border-zinc-700">
                        <CardHeader>
                            <CardTitle className="text-white text-lg">Assigned Reviewers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-3">
                                {reviewers?.map((reviewer) => {
                                    const initials = reviewer.full_name
                                        .split(' ')
                                        .map(n => n[0])
                                        .join('')
                                        .toUpperCase()
                                        .slice(0, 2);

                                    return (
                                        <div
                                            key={reviewer.id}
                                            className="flex items-center gap-2 bg-zinc-700 rounded-full px-3 py-1"
                                        >
                                            <Avatar className="h-6 w-6">
                                                <AvatarFallback className="text-xs bg-emerald-600">
                                                    {initials}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-sm text-white">{reviewer.full_name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Proposal Content */}
                <Card className="bg-zinc-800/50 border-zinc-700">
                    <CardHeader>
                        <CardTitle className="text-white text-lg">Proposal Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ProposalEditor
                            content={proposal.content as Record<string, unknown>}
                            editable={false}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
