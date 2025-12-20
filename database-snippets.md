# ⚡️ CINESONIC SECURITY COMMAND CENTER (V2.0)

**Clearance:** Level 5 (Admin/Owner)
**Context:** Supabase SQL Editor / Local Terminal

---

## 🟢 I. THE KEYMASTER (ONBOARDING & ACCESS)

*Use these to generate entry tokens for talent and crew.*

### 1. Generate a New Access Key
*Creates a secure, unique key for a specific role. Share this code with the user.*

```sql
INSERT INTO public.site_keys (key_code, assigned_role, is_active)
VALUES 
  ('CS-ACTOR-' || substring(md5(random()::text) from 1 for 6), 'actor', true),
  ('CS-CREW-' || substring(md5(random()::text) from 1 for 6), 'crew', true);
  
-- RETURNING *; -- Uncomment to see the generated keys immediately