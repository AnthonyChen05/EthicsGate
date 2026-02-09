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

// Supabase Database type - matches @supabase/supabase-js expected format
export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          slug: string;
          settings: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          settings?: Record<string, unknown>;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          settings?: Record<string, unknown>;
          created_at?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          id: string;
          organization_id: string;
          email: string;
          full_name: string;
          role: UserRole;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          organization_id: string;
          email: string;
          full_name: string;
          role: UserRole;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          email?: string;
          full_name?: string;
          role?: UserRole;
          avatar_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      proposals: {
        Row: {
          id: string;
          organization_id: string;
          title: string;
          content: Record<string, unknown>;
          status: ProposalStatus;
          submitted_by: string;
          assigned_reviewers: string[];
          attachments: string[];
          submitted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          title: string;
          content: Record<string, unknown>;
          status?: ProposalStatus;
          submitted_by: string;
          assigned_reviewers?: string[];
          attachments?: string[];
          submitted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          title?: string;
          content?: Record<string, unknown>;
          status?: ProposalStatus;
          submitted_by?: string;
          assigned_reviewers?: string[];
          attachments?: string[];
          submitted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      annotations: {
        Row: {
          id: string;
          proposal_id: string;
          reviewer_id: string;
          highlight_from: number;
          highlight_to: number;
          comment_text: string;
          annotation_type: AnnotationType;
          is_resolved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          proposal_id: string;
          reviewer_id: string;
          highlight_from: number;
          highlight_to: number;
          comment_text: string;
          annotation_type: AnnotationType;
          is_resolved?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          proposal_id?: string;
          reviewer_id?: string;
          highlight_from?: number;
          highlight_to?: number;
          comment_text?: string;
          annotation_type?: AnnotationType;
          is_resolved?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      annotation_replies: {
        Row: {
          id: string;
          annotation_id: string;
          user_id: string;
          reply_text: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          annotation_id: string;
          user_id: string;
          reply_text: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          annotation_id?: string;
          user_id?: string;
          reply_text?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          proposal_id: string;
          reviewer_id: string;
          decision: ReviewDecision;
          reason: string;
          linked_annotation_ids: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          proposal_id: string;
          reviewer_id: string;
          decision: ReviewDecision;
          reason: string;
          linked_annotation_ids?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          proposal_id?: string;
          reviewer_id?: string;
          decision?: ReviewDecision;
          reason?: string;
          linked_annotation_ids?: string[];
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
      proposal_status: ProposalStatus;
      annotation_type: AnnotationType;
      review_decision: ReviewDecision;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
