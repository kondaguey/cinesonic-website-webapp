"use server";

import { createClient } from "@supabase/supabase-js";

// 🟢 1. INITIALIZE CLIENT FIRST (Must be at the top)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// --- HELPER: BREVO BLACKLIST ---
async function blacklistOnBrevo(email) {
  if (!process.env.BREVO_API_KEY) return;

  // Brevo API to blacklist a contact
  const url = `https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`;

  const options = {
    method: "PUT",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      emailBlacklisted: true, // Stops all marketing emails
    }),
  };

  try {
    await fetch(url, options);
  } catch (error) {
    console.error("Brevo Blacklist Error:", error);
  }
}

// --- HELPER: BREVO SYNC ---
async function syncWithBrevo(email, source) {
  if (!process.env.BREVO_API_KEY) return;

  const url = "https://api.brevo.com/v3/contacts";

  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      email: email,
      updateEnabled: true, // If they exist, update them (don't error)
      attributes: {
        SOURCE: source,
      },
    }),
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      // We check for error, but we don't block the UI if Brevo fails
      const errorData = await response.json();
      console.error("Brevo Sync Error:", errorData);
    }
  } catch (error) {
    console.error("Brevo Network Error:", error);
  }
}

// --- ACTION 1: UNSUBSCRIBE ---
export async function unsubscribeUser(formData) {
  const email = formData.get("email");

  if (!email) return { success: false, message: "Email required." };

  try {
    // 1. UPDATE SUPABASE (Via Secure RPC)
    const { error } = await supabase.rpc("unsubscribe_lead", {
      target_email: email,
    });

    if (error) {
      console.error("Supabase Unsub Error:", error);
    }

    // 2. UPDATE BREVO
    await blacklistOnBrevo(email);

    return { success: true, message: "You have been unsubscribed." };
  } catch (err) {
    return { success: false, message: "System error." };
  }
}

// --- ACTION 2: SUBSCRIBE ---
export async function subscribeToWaitlist(formData) {
  const email = formData.get("email");
  const source = formData.get("source") || "general";

  if (!email || !email.includes("@")) {
    return { success: false, message: "Invalid email address." };
  }

  try {
    // A. SAVE TO SUPABASE
    const { error } = await supabase.from("leads").insert([
      {
        email: email,
        source: source,
        status: "active",
      },
    ]);

    // Handle Supabase Duplicates gracefully (Code 23505)
    if (error && error.code !== "23505") {
      console.error("Supabase Error:", error);
      return { success: false, message: "Transmission failed. Try again." };
    }

    // B. PUSH TO BREVO
    await syncWithBrevo(email, source);

    return { success: true, message: "Access Granted. We'll be in touch." };
  } catch (err) {
    console.error("Server Action Error:", err);
    return { success: false, message: "System malfunction." };
  }
}
