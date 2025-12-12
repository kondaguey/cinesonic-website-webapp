export function runCreativeMatch(role, roster) {
  if (!roster || !role) return [];

  // 1. NORMALIZE INPUTS
  const roleGender = (role["Gender"] || "any").toLowerCase().trim();
  const roleAge = (role["Age Range"] || "").toLowerCase().trim();
  const roleSpecs = (role["Vocal Specs"] || "").toLowerCase();

  // 2. STRICT GENDER FILTER (The Wall)
  let candidates = roster.filter((actor) => {
    const actorGender = (actor.gender || "").toLowerCase().trim();

    // If role is ANY or TBD, allow everyone
    if (["any", "tbd", ""].includes(roleGender)) return true;

    // STRICT MALE: Must include "male" but NOT "female"
    // (Prevents "Female" from matching "Male")
    if (roleGender === "male") {
      return actorGender.includes("male") && !actorGender.includes("female");
    }

    // STRICT FEMALE: Must include "female"
    if (roleGender === "female") {
      return actorGender.includes("female");
    }

    // Exact match for others (e.g. Non-Binary)
    return actorGender === roleGender;
  });

  // 3. WEIGHTED SCORING
  const scoredCandidates = candidates.map((actor) => {
    let score = 0;

    // DATA MAPPING
    // Handle cases where keys might differ slightly between admin/talent views
    const actorAges = (actor.ages || actor.age_range || "").toLowerCase();
    const actorVoice = (actor.voice || "").toLowerCase();
    const actorGenres = (actor.genres || "").toLowerCase();

    // A. AGE MATCH (60%)
    // This is the heaviest weight. If they sound the right age, they are viable.
    if (roleAge && actorAges.includes(roleAge)) {
      score += 60;
    }

    // B. KEYWORD ANALYSIS (Voice 30% / Genre 10%)
    // Break down the Role Specs into words (e.g. "Raspy, Villain, Horror")
    const keywords = roleSpecs.split(/[\s,.-]+/).filter((k) => k.length > 3);

    let voicePoints = 0;
    let genrePoints = 0;

    keywords.forEach((word) => {
      // Voice Matches (Worth more)
      if (actorVoice.includes(word)) voicePoints += 15; // 2 matches caps this category

      // Genre Matches (Worth less, but helpful)
      if (actorGenres.includes(word)) genrePoints += 10;
    });

    // Cap the sub-categories
    score += Math.min(voicePoints, 30);
    score += Math.min(genrePoints, 10);

    // C. BASE SCORE (+5 pts)
    // Ensures everyone valid shows up with at least a small score
    score += 5;

    // HARD CAP at 99% (Nobody is perfect)
    return {
      actor: actor,
      score: Math.min(score, 99),
    };
  });

  // 4. SORT BY SCORE DESCENDING
  scoredCandidates.sort((a, b) => b.score - a.score);

  return scoredCandidates;
}
