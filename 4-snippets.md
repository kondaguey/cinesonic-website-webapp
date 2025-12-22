-- ================================================================
-- SUPABASE SQL: GLOBAL PROJECT AUDIT
-- ================================================================

-- A. RLS STATUS: Check which tables are protected and which are exposed
SELECT
relname AS table_name,
relrowsecurity AS rls_enabled
FROM
pg_class c
JOIN
pg_namespace n ON n.oid = c.relnamespace
WHERE
n.nspname = 'public' AND c.relkind = 'r'
ORDER BY
rls_enabled ASC, table_name ASC;

-- B. DETAILED POLICIES: See exactly who can SELECT/INSERT/UPDATE on every table
SELECT
schemaname,
tablename,
policyname,
permissive,
roles,
cmd AS operation,
qual AS using_expression,
with_check AS check_expression
FROM
pg_policies
WHERE
schemaname = 'public'
ORDER BY
tablename;

-- C. ALL FUNCTIONS & TRIGGERS: Peek into the logic layer (Auth triggers, lead conversions)
SELECT
n.nspname AS schema,
p.proname AS function_name,
l.lanname AS language,
pg_get_function_arguments(p.oid) AS arguments,
t.typname AS return_type,
p.prosrc AS source_code,
CASE WHEN p.prosecdef THEN 'Security Definer' ELSE 'Security Invoker' END AS security_type
FROM
pg_proc p
LEFT JOIN pg_namespace n ON n.oid = p.pronamespace
LEFT JOIN pg_language l ON l.oid = p.prolang
LEFT JOIN pg_type t ON t.oid = p.prorettype
WHERE
n.nspname = 'public'
ORDER BY
function_name;

-- D. CHECK AUTH SCHEMA TRIGGERS: See how profiles are created on signup
SELECT
event_object_table AS table_name,
trigger_name,
event_manipulation AS event,
action_statement AS action,
action_timing AS timing
FROM
information_schema.triggers
WHERE
event_object_schema = 'public'
ORDER BY
table_name;

-- E. List every column in the project (Useful for Zipper Logic mapping)
SELECT
table_name,
column_name,
data_type,
is_nullable,
column_default
FROM
information_schema.columns
WHERE
table_schema = 'public'
ORDER BY
table_name, ordinal_position;

-- F. TABLE DATA INSPECTOR: See the actual content of the Dictionary
-- This is critical for verifying your Genres, Voice Types, and Styles.
SELECT \* FROM
public.lists
ORDER BY
category ASC,
sort_order ASC;

-- G. SPECIFIC CATEGORY CHECK: If you want to isolate just Genres or Ages
-- SELECT _ FROM public.lists WHERE category = 'genre';
-- SELECT _ FROM public.lists WHERE category = 'age_range';

-- ================================================================
-- FILE SYSTEM
-- ================================================================

tree -L 5 -I 'node_modules|.next|.git|public'

-- ================================================================
-- COOKIES AND STORAGE
-- ================================================================

// 1. Wipe Storage
localStorage.clear();
sessionStorage.clear();

// 2. Wipe Cookies (Force Supabase Auth to drop JWT)
document.cookie.split(";").forEach(function(c) {
document.cookie = c.replace(/^ +/, "").replace(/=.\*/, "=;expires=" + new Date().toUTCString() + ";path=/");
});

// 3. Hard Reset
console.log("Terminal Cleared. Re-authenticating...");
location.reload();
