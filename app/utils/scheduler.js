export const checkSchedule = (
  actorName,
  projectStartStr,
  projectEndStr,
  roster
) => {
  if (!actorName) return { status: "NEUTRAL", message: "Unassigned" };

  const actor = roster.find(
    (r) => (r["name"] || "").toLowerCase() === actorName.toLowerCase()
  );
  if (!actor)
    return { status: "UNKNOWN", message: "Actor not found in roster" };

  const projectStart = new Date(projectStartStr);
  const today = new Date();
  projectStart.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const status = (actor["status"] || "").toLowerCase();
  if (status === "on hiatus" || status === "inactive") {
    return { status: "CONFLICT", message: `Status is '${actor["status"]}'` };
  }

  const nextAvailStr = actor["next_avail"];
  if (nextAvailStr) {
    const nextAvail = new Date(nextAvailStr);
    if (!isNaN(nextAvail.getTime())) {
      nextAvail.setHours(0, 0, 0, 0);
      if (nextAvail > today && projectStart < nextAvail) {
        return {
          status: "CONFLICT",
          message: `Not avail until ${nextAvail.toLocaleDateString()}`,
        };
      }
    }
  }

  const bookoutsStr = actor["bookouts"];
  if (bookoutsStr) {
    const ranges = bookoutsStr.split(",").map((s) => s.trim());
    for (let range of ranges) {
      const parts = range.split(/ to | - /i);
      if (parts.length === 2) {
        const bookStart = new Date(parts[0]);
        const bookEnd = new Date(parts[1]);
        if (!isNaN(bookStart.getTime()) && !isNaN(bookEnd.getTime())) {
          bookStart.setHours(0, 0, 0, 0);
          bookEnd.setHours(0, 0, 0, 0);
          if (projectStart >= bookStart && projectStart <= bookEnd) {
            return {
              status: "CONFLICT",
              message: `Booked: ${parts[0]} - ${parts[1]}`,
            };
          }
        }
      }
    }
  }

  return { status: "CLEAR", message: "Available" };
};
