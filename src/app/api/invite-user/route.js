import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { email, role, clearance, full_name } = await request.json();

  // 1. Init God Mode Client (Service Role)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // MUST use Service Key
  );

  // 2. Send the Invite with Metadata
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: {
      role: role,
      clearance: clearance,
      full_name: full_name,
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, user: data.user });
}
