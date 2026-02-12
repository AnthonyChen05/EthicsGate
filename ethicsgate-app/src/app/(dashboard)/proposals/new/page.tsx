'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { createProposalSchema } from '@/lib/validators/proposal';
import { ProposalEditor } from '@/components/editor/proposal-editor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Save, Send, Lightbulb } from 'lucide-react';

export default function NewProposalPage() {
    const router = useRouter();
    const supabase = createClient();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState<Record<string, unknown>>({
        type: 'doc',
        content: [{ type: 'paragraph' }],
    });
    const [saving, setSaving] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleSave = async (submit = false) => {
        const setLoading = submit ? setSubmitting : setSaving;
        setLoading(true);

        const result = createProposalSchema.safeParse({ title, content });
        if (!result.success) {
            toast.error(result.error.issues[0].message);
            setLoading(false);
            return;
        }

        try {
            // Get current user
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) {
                toast.error('Please sign in to create a proposal');
                router.push('/login');
                return;
            }

            const { data: user } = await supabase
                .from('users')
                .select('organization_id')
                .eq('id', authUser.id)
                .single();

            if (!user) {
                toast.error('User profile not found');
                return;
            }

            const { data: proposal, error } = await supabase
                .from('proposals')
                .insert({
                    title,
                    content,
                    organization_id: user.organization_id,
                    submitted_by: authUser.id,
                    status: submit ? 'submitted' : 'draft',
                    submitted_at: submit ? new Date().toISOString() : null,
                    assigned_reviewers: [],
                    attachments: [],
                })
                .select()
                .single();

            if (error) {
                toast.error(error.message);
                setLoading(false);
                return;
            }

            toast.success(submit ? 'Proposal submitted for review!' : 'Draft saved');
            router.push(`/proposals/${proposal.id}`);
            router.refresh();
        } catch (err) {
            console.error('Error saving proposal:', err);
            toast.error('An unexpected error occurred');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                        <Link href="/proposals">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <h1 className="text-xl font-semibold text-foreground">New Proposal</h1>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleSave(false)}
                        disabled={saving || submitting}
                        className="border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                        <Save className="mr-2 h-4 w-4" />
                        {saving ? 'Saving...' : 'Save Draft'}
                    </Button>
                    <Button
                        onClick={() => handleSave(true)}
                        disabled={saving || submitting}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                        <Send className="mr-2 h-4 w-4" />
                        {submitting ? 'Submitting...' : 'Submit for Review'}
                    </Button>
                </div>
            </div>

            {/* Tips */}
            <div className="bg-muted/50 border border-border rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                    <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Tips for a strong proposal:</strong>
                        <span className="block mt-1">
                            Include clear research objectives, methodology details, participant information,
                            and how you&apos;ll handle data ethically.
                        </span>
                    </div>
                </div>
            </div>

            {/* Form */}
            <Card className="bg-card border-border">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-medium text-foreground">Proposal Details</CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Describe your research in detail for the ethics review committee.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-foreground">
                            Proposal Title
                        </Label>
                        <Input
                            id="title"
                            placeholder="Enter a descriptive title for your research proposal"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-foreground">Proposal Content</Label>
                        <ProposalEditor
                            content={content}
                            onChange={setContent}
                            placeholder="Describe your research proposal in detail..."
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
