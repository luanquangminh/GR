-- Step 1: Rename column victimid -> evaluatee_id
ALTER TABLE evaluations RENAME COLUMN victimid TO evaluatee_id;

-- Step 2: Make point NOT NULL with default 0 (no null records exist)
UPDATE evaluations SET point = 0 WHERE point IS NULL;
ALTER TABLE evaluations ALTER COLUMN point SET NOT NULL;
ALTER TABLE evaluations ALTER COLUMN point SET DEFAULT 0;

-- Step 3: Make staff.name and staff.staffcode NOT NULL (no null records exist)
ALTER TABLE staff ALTER COLUMN name SET NOT NULL;
ALTER TABLE staff ALTER COLUMN staffcode SET NOT NULL;

-- Step 4: Add unique constraint on staff.emails (schoolEmail)
-- (Already checked: no duplicates exist)
CREATE UNIQUE INDEX IF NOT EXISTS "staff_emails_key" ON staff("emails");

-- Step 5: Add unique constraint on organizationunits.name
CREATE UNIQUE INDEX IF NOT EXISTS "organizationunits_name_key" ON organizationunits("name");

-- Step 6: Add timestamps to organizationunits
ALTER TABLE organizationunits ADD COLUMN IF NOT EXISTS created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE organizationunits ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Step 7: Add timestamps to subjects
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE subjects ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Step 8: Add composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS "evaluations_reviewerid_periodid_idx" ON evaluations("reviewerid", "periodid");
CREATE INDEX IF NOT EXISTS "evaluations_evaluatee_id_periodid_idx" ON evaluations("evaluatee_id", "periodid");
CREATE INDEX IF NOT EXISTS "evaluations_evaluatee_id_groupid_periodid_idx" ON evaluations("evaluatee_id", "groupid", "periodid");

-- Step 9: Update unique constraint to use new column name
-- Drop old unique constraint and recreate with new column name
ALTER TABLE evaluations DROP CONSTRAINT IF EXISTS "reviewer_evaluatee_group_question_period";
CREATE UNIQUE INDEX "reviewer_evaluatee_group_question_period" ON evaluations("reviewerid", "evaluatee_id", "groupid", "questionid", "periodid");

-- Step 10: Update index on evaluateeid to use new column name
DROP INDEX IF EXISTS "evaluations_evaluateeid_idx";
CREATE INDEX "evaluations_evaluateeid_idx" ON evaluations("evaluatee_id");
