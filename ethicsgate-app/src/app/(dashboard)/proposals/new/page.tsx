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
                        className="text-[#7A756F] hover:text-[#3D3835] hover:bg-[#F5F0E8]"
                    >
                        <Link href="/proposals">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <h1 className="text-xl font-semibold text-[#3D3835]">New Proposal</h1>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => handleSave(false)}
                        disabled={saving || submitting}
                        className="border-[#E8E3DB] text-[#6B6560] hover:bg-[#F5F0E8] hover:text-[#3D3835]"
                    >
                        <Save className="mr-2 h-4 w-4" />
                        {saving ? 'Saving...' : 'Save Draft'}
                    </Button>
                    <Button
                        onClick={() => handleSave(true)}
                        disabled={saving || submitting}
                        className="bg-[#C77B58] hover:bg-[#B06A48] text-white"
                    >
                        <Send className="mr-2 h-4 w-4" />
                        {submitting ? 'Submitting...' : 'Submit for Review'}
                    </Button>
                </div>
            </div>

            {/* Tips */}
            <div className="bg-[#FDF8F4] border border-[#F0EBE3] rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                    <Lightbulb className="h-5 w-5 text-[#C77B58] flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-[#6B6560]">
                        <strong className="text-[#4A4540]">Tips for a strong proposal:</strong>
                        <span className="block mt-1">
                            Include clear research objectives, methodology details, participant information,
                            and how you&apos;ll handle data ethically.
                        </span>
                    </div>
                </div>
            </div>

            {/* Form */}
            <Card className="bg-white border-[#E8E3DB]">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-medium text-[#3D3835]">Proposal Details</CardTitle>
                    <CardDescription className="text-[#7A756F]">
                        Describe your research in detail for the ethics review committee.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-[#4A4540]">
                            Proposal Title
                        </Label>
                        <Input
                            id="title"
                            placeholder="Enter a descriptive title for your research proposal"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-white border-[#E8E3DB] text-[#3D3835] placeholder:text-[#A8A39D] focus:border-[#C77B58] focus:ring-[#C77B58]"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[#4A4540]">Proposal Content</Label>
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
