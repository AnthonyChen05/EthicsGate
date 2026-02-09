import type { ProposalStatus } from '@/types/database';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
    status: ProposalStatus;
    className?: string;
}

const statusConfig: Record<ProposalStatus, { label: string; className: string }> = {
    draft: {
        label: 'Draft',
        className: 'bg-[#F0EBE3] text-[#6B6560] border-[#E8E3DB]'
    },
    submitted: {
        label: 'Submitted',
        className: 'bg-[#FEF3E0] text-[#B08A50] border-[#F5E0C0]'
    },
    under_review: {
        label: 'In Review',
        className: 'bg-[#E8F4F8] text-[#4A8A90] border-[#C8E4E8]'
    },
    approved: {
        label: 'Approved',
        className: 'bg-[#E8F5E9] text-[#5A8A5E] border-[#C8E8CA]'
    },
    rejected: {
        label: 'Not Approved',
        className: 'bg-[#FDECEB] text-[#C75450] border-[#F5D0CE]'
    },
    revise_and_resubmit: {
        label: 'Revisions Needed',
        className: 'bg-[#FFF4E8] text-[#C77B58] border-[#F5E0D0]'
    },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <Badge
            variant="outline"
            className={cn(
                'font-medium text-xs border',
                config.className,
                className
            )}
        >
            {config.label}
        </Badge>
    );
}
