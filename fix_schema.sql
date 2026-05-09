-- Run this in your Supabase SQL Editor to allow decimal values (e.g., 3.5) from sliders

ALTER TABLE dreams
ALTER COLUMN vividness TYPE NUMERIC USING vividness::NUMERIC,
ALTER COLUMN length TYPE NUMERIC USING length::NUMERIC,
ALTER COLUMN rating TYPE NUMERIC USING rating::NUMERIC;
