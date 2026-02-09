-- EthicsGate Row Level Security Policies
-- Migration 002: Enable RLS and create access policies

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE annotation_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's organization
CREATE OR REPLACE FUNCTION get_user_organization_id()
RETURNS UUID AS $$
  SELECT organization_id FROM users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function to get current user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
  SELECT role FROM users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER;

-- ===================
-- ORGANIZATIONS POLICIES
-- ===================

-- Users can only see their own organization
CREATE POLICY "Users can view own organization"
  ON organizations FOR SELECT
  USING (id = get_user_organization_id());

-- Only during signup (no auth yet, service role handles this)
CREATE POLICY "Allow organization creation"
  ON organizations FOR INSERT
  WITH CHECK (true);

-- Admins can update their organization
CREATE POLICY "Admins can update organization"
  ON organizations FOR UPDATE
  USING (id = get_user_organization_id() AND get_user_role() = 'admin');

-- ===================
-- USERS POLICIES
-- ===================

-- Users can see other users in their organization
CREATE POLICY "Users can view users in their organization"
  ON users FOR SELECT
  USING (organization_id = get_user_organization_id());

-- Allow user creation (handled during signup/invite)
CREATE POLICY "Allow user creation"
  ON users FOR INSERT
  WITH CHECK (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Admins can update any user in their organization
CREATE POLICY "Admins can update users in organization"
  ON users FOR UPDATE
  USING (
    organization_id = get_user_organization_id() 
    AND get_user_role() = 'admin'
  );

-- ===================
-- PROPOSALS POLICIES
-- ===================

-- Researchers can see their own proposals
CREATE POLICY "Researchers view own proposals"
  ON proposals FOR SELECT
  USING (
    submitted_by = auth.uid()
    OR 
    -- Reviewers can see assigned proposals
    (auth.uid() = ANY(assigned_reviewers))
    OR
    -- Admins can see all proposals in their org
    (organization_id = get_user_organization_id() AND get_user_role() = 'admin')
  );

-- Researchers can create proposals
CREATE POLICY "Researchers can create proposals"
  ON proposals FOR INSERT
  WITH CHECK (
    organization_id = get_user_organization_id()
    AND submitted_by = auth.uid()
  );

-- Researchers can update their own draft proposals
CREATE POLICY "Researchers can update own draft proposals"
  ON proposals FOR UPDATE
  USING (
    submitted_by = auth.uid() 
    AND status = 'draft'
  );

-- Admins can update any proposal in their org (for assignment)
CREATE POLICY "Admins can update proposals"
  ON proposals FOR UPDATE
  USING (
    organization_id = get_user_organization_id() 
    AND get_user_role() = 'admin'
  );

-- Reviewers can update status on assigned proposals
CREATE POLICY "Reviewers can update assigned proposals"
  ON proposals FOR UPDATE
  USING (
    auth.uid() = ANY(assigned_reviewers)
    AND get_user_role() = 'reviewer'
  );

-- ===================
-- ANNOTATIONS POLICIES
-- ===================

-- Proposal author and assigned reviewers can view annotations
CREATE POLICY "View annotations on accessible proposals"
  ON annotations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM proposals p
      WHERE p.id = annotations.proposal_id
      AND (
        p.submitted_by = auth.uid()
        OR auth.uid() = ANY(p.assigned_reviewers)
        OR (p.organization_id = get_user_organization_id() AND get_user_role() = 'admin')
      )
    )
  );

-- Reviewers can create annotations on assigned proposals
CREATE POLICY "Reviewers can create annotations"
  ON annotations FOR INSERT
  WITH CHECK (
    reviewer_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM proposals p
      WHERE p.id = proposal_id
      AND auth.uid() = ANY(p.assigned_reviewers)
    )
  );

-- Reviewers can update their own annotations
CREATE POLICY "Reviewers can update own annotations"
  ON annotations FOR UPDATE
  USING (reviewer_id = auth.uid());

-- ===================
-- ANNOTATION REPLIES POLICIES
-- ===================

-- Same visibility as annotations
CREATE POLICY "View replies on accessible annotations"
  ON annotation_replies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM annotations a
      JOIN proposals p ON p.id = a.proposal_id
      WHERE a.id = annotation_replies.annotation_id
      AND (
        p.submitted_by = auth.uid()
        OR auth.uid() = ANY(p.assigned_reviewers)
        OR (p.organization_id = get_user_organization_id() AND get_user_role() = 'admin')
      )
    )
  );

-- Users can reply to annotations they can see
CREATE POLICY "Users can create replies"
  ON annotation_replies FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM annotations a
      JOIN proposals p ON p.id = a.proposal_id
      WHERE a.id = annotation_id
      AND (
        p.submitted_by = auth.uid()
        OR auth.uid() = ANY(p.assigned_reviewers)
      )
    )
  );

-- ===================
-- REVIEWS POLICIES
-- ===================

-- Same visibility as proposals
CREATE POLICY "View reviews on accessible proposals"
  ON reviews FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM proposals p
      WHERE p.id = reviews.proposal_id
      AND (
        p.submitted_by = auth.uid()
        OR auth.uid() = ANY(p.assigned_reviewers)
        OR (p.organization_id = get_user_organization_id() AND get_user_role() = 'admin')
      )
    )
  );

-- Reviewers can create reviews on assigned proposals
CREATE POLICY "Reviewers can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (
    reviewer_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM proposals p
      WHERE p.id = proposal_id
      AND auth.uid() = ANY(p.assigned_reviewers)
    )
  );
