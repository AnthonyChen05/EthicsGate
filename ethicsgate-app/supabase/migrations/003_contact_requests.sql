-- Contact requests table for lead capture
CREATE TABLE contact_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    institution TEXT NOT NULL,
    role TEXT,
    message TEXT,
    status TEXT DEFAULT 'new' CHECK (
        status IN ('new', 'contacted', 'converted', 'closed')
    ),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Index for quick lookups
CREATE INDEX idx_contact_requests_status ON contact_requests(status);
CREATE INDEX idx_contact_requests_created ON contact_requests(created_at DESC);
-- Enable RLS
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;
-- Allow anyone to insert (public form)
CREATE POLICY "Anyone can submit contact request" ON contact_requests FOR
INSERT TO anon,
    authenticated WITH CHECK (true);
-- Only authenticated admins can read (you'll need to define who can access these)
-- For now, allow all authenticated users to read
CREATE POLICY "Authenticated users can read contact requests" ON contact_requests FOR
SELECT TO authenticated USING (true);
-- Only authenticated users can update
CREATE POLICY "Authenticated users can update contact requests" ON contact_requests FOR
UPDATE TO authenticated USING (true);