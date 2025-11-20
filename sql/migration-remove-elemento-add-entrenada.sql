-- Migration: Remove elemento field and add entrenada boolean field
-- Date: 2025-11-20

-- Remove the elemento column
ALTER TABLE criaturas DROP COLUMN elemento;

-- Add entrenada boolean column (TINYINT(1) for MySQL compatibility)
-- Default to 0 (false/No)
ALTER TABLE criaturas ADD COLUMN entrenada TINYINT(1) DEFAULT 0;
