-- Creating Index on reports
CREATE INDEX idx_reports_type ON reports (type);
CREATE SPATIAL INDEX idx_reports_position ON reports (position);
-- ALTER TABLE reports
-- ADD SPATIAL INDEX (position);

-- Creating Index on advertisements
CREATE SPATIAL INDEX idx_advertisements_position ON advertisements (position);
-- ALTER TABLE advertisements
-- ADD SPATIAL INDEX (position);

