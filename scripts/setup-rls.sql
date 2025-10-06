-- Enable RLS on all tables
ALTER TABLE "ContactMessage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Program" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Podcast" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "News" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Team" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Admin" ENABLE ROW LEVEL SECURITY;

-- Public read policies (anyone can view published content)
CREATE POLICY "Anyone can view active programs" ON "Program"
  FOR SELECT USING (active = true);

CREATE POLICY "Anyone can view published podcasts" ON "Podcast"
  FOR SELECT USING (published = true);

CREATE POLICY "Anyone can view published news" ON "News"
  FOR SELECT USING (published = true);

CREATE POLICY "Anyone can view active team members" ON "Team"
  FOR SELECT USING (active = true);

CREATE POLICY "Anyone can create contact messages" ON "ContactMessage"
  FOR INSERT WITH CHECK (true);

-- Admin table: completely locked down (no public access)
CREATE POLICY "No public access to Admin table" ON "Admin"
  FOR ALL USING (false);

-- Service role bypass (for your backend API to manage everything)
CREATE POLICY "Service role full access to ContactMessage" ON "ContactMessage"
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role full access to Program" ON "Program"
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role full access to Podcast" ON "Podcast"
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role full access to News" ON "News"
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role full access to Team" ON "Team"
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role full access to Admin" ON "Admin"
  FOR ALL USING (auth.jwt()->>'role' = 'service_role');