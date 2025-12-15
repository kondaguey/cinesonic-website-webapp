export function runCreativeMatch(role, roster) {
  if (!roster || !role) return [];

  // 1. NORMALIZE INPUTS
  const roleGender = (role["Gender"] || "any").toLowerCase().trim();
  const roleAge = (role["Age Range"] || "").toLowerCase().trim();
  const roleSpecs = (role["Vocal Specs"] || "").toLowerCase();

  // 🟢 NEW: Extract Requested Actor Name from specs if present
  // We look for that string we added in the Admin Portal: "**CLIENT REQUEST: Name**"
  let requestedActorName = null;
  if (roleSpecs.includes("client request:")) {
    const parts = roleSpecs.split("client request:");
    if (parts[1])
      requestedActorName = parts[1].replace(/\*\*/g, "").trim().toLowerCase();
  }

  // 2. STRICT GENDER FILTER (The Wall)
  let candidates = roster.filter((actor) => {
    // ... (Your existing gender logic is perfect, keep it) ...
    const actorGender = (actor.gender || "").toLowerCase().trim();
    if (["any", "tbd", ""].includes(roleGender)) return true;
    if (roleGender === "male")
      return actorGender.includes("male") && !actorGender.includes("female");
    if (roleGender === "female") return actorGender.includes("female");
    return actorGender === roleGender;
  });

  // 3. WEIGHTED SCORING
  const scoredCandidates = candidates.map((actor) => {
    // 🟢 NEW: INSTANT WINNER CHECK
    // If this is the actor the client requested, score = 100 immediately.
    if (requestedActorName && actor.name.toLowerCase() === requestedActorName) {
      return { actor: actor, score: 100, isRequested: true };
    }

    let score = 0;

    // ... (Your existing scoring logic) ...
    const actorAges = (actor.ages || actor.age_range || "").toLowerCase();
    const actorVoice = (actor.voice || "").toLowerCase();
    const actorGenres = (actor.genres || "").toLowerCase();

    // A. AGE MATCH (60%)
    if (roleAge && actorAges.includes(roleAge)) score += 60;

    // B. KEYWORD ANALYSIS
    const keywords = roleSpecs.split(/[\s,.-]+/).filter((k) => k.length > 3);
    let voicePoints = 0;
    let genrePoints = 0;

    keywords.forEach((word) => {
      // Skip the words "client" and "request" so they don't mess up scoring
      if (word === "client" || word === "request") return;

      if (actorVoice.includes(word)) voicePoints += 15;
      if (actorGenres.includes(word)) genrePoints += 10;
    });

    score += Math.min(voicePoints, 30);
    score += Math.min(genrePoints, 10);
    score += 5;

    return {
      actor: actor,
      score: Math.min(score, 99),
    };
  });

  // 4. SORT BY SCORE DESCENDING
  scoredCandidates.sort((a, b) => b.score - a.score);

  return scoredCandidates;
}
