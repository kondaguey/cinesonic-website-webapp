export const runCreativeMatch = (role, roster) => {
  if (!role || !roster) return [];

  const targetGender = role["Gender"] || "";
  const targetAge = role["Age Range"] || "";
  const targetVoice = role["Voice Qualities"] || "";

  const WEIGHTS = { gender: 100, age: 50, voice: 30 };

  const matches = roster.map((actor) => {
    let score = 0;
    let reasons = [];

    const actorGender = (actor["gender"] || "").toLowerCase();
    const roleGender = (targetGender || "").toLowerCase();

    if (
      roleGender === "" ||
      roleGender === "any" ||
      actorGender === roleGender
    ) {
      score += WEIGHTS.gender;
    } else {
      return { ...actor, score: 0 };
    }

    const actorAge = (actor["age_range"] || "").toLowerCase();
    const roleAge = (targetAge || "").toLowerCase();

    if (actorAge.includes(roleAge)) {
      score += WEIGHTS.age;
      reasons.push("Age Match");
    }

    const actorVoice = (actor["voice"] || "").toLowerCase();
    const roleVoice = (targetVoice || "").toLowerCase();

    if (
      actorVoice &&
      roleVoice &&
      (actorVoice.includes(roleVoice) || roleVoice.includes(actorVoice))
    ) {
      score += WEIGHTS.voice;
      reasons.push("Voice Match");
    }

    const maxScore = WEIGHTS.gender + WEIGHTS.age + WEIGHTS.voice;
    const percentage = Math.round((score / maxScore) * 100);

    return {
      name: actor["name"] || "Unknown",
      status: actor["status"] || "Available",
      email: actor["email"],
      score: percentage,
      reasons: reasons,
    };
  });

  return matches.filter((m) => m.score > 0).sort((a, b) => b.score - a.score);
};
