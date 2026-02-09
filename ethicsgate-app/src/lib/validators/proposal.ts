import { z } from 'zod';

export const createProposalSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title must be less than 200 characters'),
    content: z.record(z.unknown()), // Tiptap JSON document
});

export const updateProposalSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title must be less than 200 characters').optional(),
    content: z.record(z.unknown()).optional(),
    status: z.enum(['draft', 'submitted', 'under_review', 'approved', 'rejected', 'revise_and_resubmit']).optional(),
    assigned_reviewers: z.array(z.string().uuid()).optional(),
});

export const submitProposalSchema = z.object({
    proposalId: z.string().uuid(),
});

export type CreateProposalInput = z.infer<typeof createProposalSchema>;
export type UpdateProposalInput = z.infer<typeof updateProposalSchema>;
export type SubmitProposalInput = z.infer<typeof submitProposalSchema>;
