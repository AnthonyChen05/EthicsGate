// Database type definitions matching Supabase schema

export type UserRole = 'researcher' | 'reviewer' | 'admin';

export type ProposalStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'revise_and_resubmit';

export type AnnotationType = 'comment' | 'concern' | 'suggestion';

export type ReviewDecision = 'approve' | 'reject' | 'revise_and_resubmit';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  settings: Record<string, unknown>;
  created_at: string;
}

export interface User {
  id: string;
  organization_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
}

export interface Proposal {
  id: string;
  organization_id: string;
  title: string;
  content: Record<string, unknown>; // Tiptap JSON
  status: ProposalStatus;
  submitted_by: string;
  assigned_reviewers: string[];
  attachments: string[];
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Annotation {
  id: string;
  proposal_id: string;
  reviewer_id: string;
  highlight_from: number;
  highlight_to: number;
  comment_text: string;
  annotation_type: AnnotationType;
  is_resolved: boolean;
  created_at: string;
}

export interface AnnotationReply {
  id: string;
  annotation_id: string;
  user_id: string;
  reply_text: string;
  created_at: string;
}

export interface Review {
  id: string;
  proposal_id: string;
  reviewer_id: string;
  decision: ReviewDecision;
  reason: string;
  linked_annotation_ids: string[];
  created_at: string;
}

// Extended types with relations
export interface ProposalWithAuthor extends Proposal {
  author?: User;
}

export interface AnnotationWithReplies extends Annotation {
  replies?: AnnotationReply[];
  reviewer?: User;
}

export interface ProposalWithRelations extends Proposal {
  author?: User;
  annotations?: AnnotationWithReplies[];
  reviews?: Review[];
}

// Supabase Database type helper
export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: Organization;
        Insert: {
          name: string;
          slug: string;
          id?: string;
          settings?: Record<string, unknown>;
          created_at?: string;
        };
        Update: Partial<Omit<Organization, 'id'>>;
      };
      users: {
        Row: User;
        Insert: {
          id: string;
          organization_id: string;
          email: string;
          full_name: string;
          role: UserRole;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: Partial<Omit<User, 'id'>>;
      };
      proposals: {
        Row: Proposal;
        Insert: Omit<Proposal, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string
        };
        Update: Partial<Omit<Proposal, 'id'>>;
      };
      annotations: {
        Row: Annotation;
        Insert: Omit<Annotation, 'id' | 'created_at' | 'is_resolved'> & {
          id?: string;
          created_at?: string;
          is_resolved?: boolean;
        };
        Update: Partial<Omit<Annotation, 'id'>>;
      };
      annotation_replies: {
        Row: AnnotationReply;
        Insert: Omit<AnnotationReply, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string
        };
        Update: Partial<Omit<AnnotationReply, 'id'>>;
      };
      reviews: {
        Row: Review;
        Insert: Omit<Review, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string
        };
        Update: Partial<Omit<Review, 'id'>>;
      };
    };
    Enums: {
      user_role: UserRole;
      proposal_status: ProposalStatus;
      annotation_type: AnnotationType;
      review_decision: ReviewDecision;
    };
  };
}
