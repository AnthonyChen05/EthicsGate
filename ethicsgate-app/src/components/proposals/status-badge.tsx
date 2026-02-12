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
        className: 'bg-muted text-muted-foreground border-border'
    },
    submitted: {
        label: 'Submitted',
        className: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
    },
    under_review: {
        label: 'In Review',
        className: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800'
    },
    approved: {
        label: 'Approved',
        className: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800'
    },
    rejected: {
        label: 'Not Approved',
        className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
    },
    revise_and_resubmit: {
        label: 'Revisions Needed',
        className: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800'
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
