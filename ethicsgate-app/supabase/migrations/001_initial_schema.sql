-- EthicsGate Initial Schema
-- Migration 001: Create base tables and enums

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
CREATE TYPE user_role AS ENUM ('researcher', 'reviewer', 'admin');
CREATE TYPE proposal_status AS ENUM ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'revise_and_resubmit');
CREATE TYPE annotation_type AS ENUM ('comment', 'concern', 'suggestion');
CREATE TYPE review_decision AS ENUM ('approve', 'reject', 'revise_and_resubmit');

-- Organizations table
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users table (references auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'researcher',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for organization lookups
CREATE INDEX idx_users_organization ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);

-- Proposals table
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  status proposal_status NOT NULL DEFAULT 'draft',
  submitted_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_reviewers UUID[] DEFAULT '{}',
  attachments TEXT[] DEFAULT '{}',
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indices for proposal lookups
CREATE INDEX idx_proposals_organization ON proposals(organization_id);
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_proposals_submitted_by ON proposals(submitted_by);

-- Annotations table
CREATE TABLE annotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  highlight_from INTEGER NOT NULL,
  highlight_to INTEGER NOT NULL,
  comment_text TEXT NOT NULL,
  annotation_type annotation_type NOT NULL DEFAULT 'comment',
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_annotations_proposal ON annotations(proposal_id);

-- Annotation replies table
CREATE TABLE annotation_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  annotation_id UUID NOT NULL REFERENCES annotations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reply_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_annotation_replies_annotation ON annotation_replies(annotation_id);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  proposal_id UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  decision review_decision NOT NULL,
  reason TEXT NOT NULL,
  linked_annotation_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_proposal ON reviews(proposal_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for proposals updated_at
CREATE TRIGGER update_proposals_updated_at
  BEFORE UPDATE ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
