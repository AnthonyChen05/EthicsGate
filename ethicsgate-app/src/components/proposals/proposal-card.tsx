import Link from 'next/link';
import type { Proposal, User } from '@/types/database';
import { StatusBadge } from './status-badge';
import { formatDistanceToNow } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface ProposalCardProps {
    proposal: Proposal;
    author?: User;
    showAuthor?: boolean;
}

export function ProposalCard({ proposal, author, showAuthor = false }: ProposalCardProps) {
    return (
        <Link
            href={`/proposals/${proposal.id}`}
            className="block"
        >
            <div className="flex items-center justify-between p-3 rounded-lg border border-[#E8E3DB] hover:border-[#D4C8BC] hover:bg-[#FDFCFB] transition-colors group">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="font-medium text-[#3D3835] truncate">
                            {proposal.title}
                        </h3>
                        <StatusBadge status={proposal.status} />
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-[#7A756F]">
                        {showAuthor && author && (
                            <>
                                <span>{author.full_name}</span>
                                <span>•</span>
                            </>
                        )}
                        <span>
                            Updated {formatDistanceToNow(new Date(proposal.updated_at))}
                        </span>
                    </div>
                </div>
                <ChevronRight className="h-4 w-4 text-[#A8A39D] group-hover:text-[#6B6560] transition-colors flex-shrink-0" />
            </div>
        </Link>
    );
}
