export function runCreativeMatch(role, roster) {
  if (!roster || !role) return [];

  // 1. NORMALIZE INPUTS
  const roleGender = (role.gender || "any").toLowerCase().trim();
  const roleAge = (role.age || "").toLowerCase().trim();
  const roleGenre = (role.genre || "").toLowerCase().trim();
  const roleAccent = (role.accent || "").toLowerCase().trim();
  const roleVoices = (role.voiceTypes || []).map((v) => v.toLowerCase());

  // Client Request Check (Instant Win)
  const roleSpecs = (role.specs || "").toLowerCase();
  let requestedActorName = null;
  if (roleSpecs.includes("client request:")) {
    const parts = roleSpecs.split("client request:");
    if (parts[1])
      requestedActorName = parts[1].replace(/\*\*/g, "").trim().toLowerCase();
  }

  // 2. STRICT GENDER FILTER (The Gatekeeper)
  // If gender doesn't match, they don't even get scored.
  let candidates = roster.filter((actor) => {
    const actorGender = (actor.gender || "").toLowerCase().trim();
    if (["any", "tbd", ""].includes(roleGender)) return true;
    if (actorGender === "any") return true;
    if (roleGender === "male") return actorGender === "male";
    if (roleGender === "female") return actorGender === "female";
    return actorGender === roleGender;
  });

  // 3. WEIGHTED SCORING (Total: 100pts)
  const scoredCandidates = candidates.map((actor) => {
    // A. INSTANT WINNER CHECK
    if (requestedActorName && actor.name.toLowerCase() === requestedActorName) {
      return { actor: actor, score: 100, isRequested: true };
    }

    let score = 0;

    // Data Prep
    const actorAges = (actor.ages || actor.age_range || "").toLowerCase();
    const actorVoiceStr = (actor.voice || "").toLowerCase();
    const actorGenres = (actor.genres || "").toLowerCase();
    const actorAccents = (actor.accents || "").toLowerCase();

    // --- PRIORITY 1: AGE (35%) ---
    if (roleAge && actorAges.includes(roleAge)) score += 35;

    // --- PRIORITY 2: VOCAL QUALITIES (25%) ---
    // Check for overlap between character's selected tags and actor's voice string
    let voiceHit = false;
    roleVoices.forEach((v) => {
      if (actorVoiceStr.includes(v)) voiceHit = true;
    });
    if (voiceHit) score += 25;

    // --- PRIORITY 3: GENRE (20%) ---
    if (roleGenre && actorGenres.includes(roleGenre)) score += 20;

    // --- PRIORITY 4: ACCENT (15%) ---
    if (
      roleAccent &&
      (actorAccents.includes(roleAccent) || roleAccent === "general american")
    )
      score += 15;

    // --- BASELINE (5%) ---
    score += 5;

    return {
      actor: actor,
      score: Math.min(score, 99),
    };
  });

  // 4. SORT BY SCORE DESCENDING
  return scoredCandidates.sort((a, b) => b.score - a.score);
}
