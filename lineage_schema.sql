-- Add Manual Lineage Fields
ALTER TABLE geckos
ADD COLUMN IF NOT EXISTS sire_name text,
ADD COLUMN IF NOT EXISTS dam_name text,
ADD COLUMN IF NOT EXISTS proof_image_url text;

-- Comment on columns
COMMENT ON COLUMN geckos.sire_name IS 'Name of the sire if not registered in system';
COMMENT ON COLUMN geckos.dam_name IS 'Name of the dam if not registered in system';
COMMENT ON COLUMN geckos.proof_image_url IS 'URL of hatching card or parent photo for verification';

-- Update RLS if needed (Update/Insert policies usually cover all columns, but good to check)
-- Existing policies for 'geckos' should handle these new columns automatically if they are 'using (true)' or standard owner checks.
