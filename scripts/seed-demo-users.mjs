/**
 * Seed demo Supabase Auth users for local console.
 * Requires SUPABASE_SERVICE_ROLE_KEY + NEXT_PUBLIC_SUPABASE_URL in .env.local
 *
 *   node --env-file=.env.local scripts/seed-demo-users.mjs
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const DEMO_PASSWORD = "Demo@1234";

// Use real TLDs — Supabase rejects addresses like *@aiva.demo
const users = [
  { email: "admin@aiva.app", display_name: "AIva Admin", role: "admin" },
  { email: "teacher@aiva.app", display_name: "Cô Lan", role: "teacher" },
  { email: "parent@aiva.app", display_name: "Phụ huynh Minh", role: "parent" },
];

for (const u of users) {
  const { data: listed } = await supabase.auth.admin.listUsers({ page: 1, perPage: 200 });
  const existing = listed?.users?.find((row) => row.email?.toLowerCase() === u.email.toLowerCase());

  if (existing) {
    const { error } = await supabase.auth.admin.updateUserById(existing.id, {
      password: DEMO_PASSWORD,
      email_confirm: true,
      user_metadata: { role: u.role, display_name: u.display_name },
    });
    if (error) {
      console.error("update failed", u.email, error.message);
    } else {
      console.log("updated", u.email, u.role);
    }
    continue;
  }

  const { error } = await supabase.auth.admin.createUser({
    email: u.email,
    password: DEMO_PASSWORD,
    email_confirm: true,
    user_metadata: { role: u.role, display_name: u.display_name },
  });

  if (error) {
    console.error("create failed", u.email, error.message);
  } else {
    console.log("created", u.email, u.role);
  }
}

console.log("Done. Password for all:", DEMO_PASSWORD);
