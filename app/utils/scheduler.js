export function checkSchedule(actor, projectStartDate) {
  if (!actor) return { status: "unknown", reason: "No Actor" };

  // 1. STATUS CHECK (Immediate Fail)
  const status = (actor.status || "").toLowerCase();
  if (status.includes("hiatus") || status.includes("inactive")) {
    return { status: "unavailable", reason: "Status: " + actor.status };
  }

  // 2. PARSE PROJECT DATE
  // If no start date is set, we can't calculate conflicts
  if (!projectStartDate) return { status: "unknown", reason: "Set Start Date" };

  const pDate = new Date(projectStartDate);
  if (isNaN(pDate.getTime()))
    return { status: "unknown", reason: "Invalid Start Date" };
  pDate.setHours(0, 0, 0, 0); // Normalize time

  // 3. NEXT AVAILABLE CHECK (Column J)
  // Handles ISO "2026-01-02T..." OR Plain Text "2026-01-02"
  if (actor.next_avail) {
    const nextAvailDate = new Date(actor.next_avail);

    // Only check if it's a valid date
    if (!isNaN(nextAvailDate.getTime())) {
      nextAvailDate.setHours(0, 0, 0, 0);

      // If Project Start < Next Available
      if (pDate < nextAvailDate) {
        return {
          status: "unavailable",
          reason: `Busy until ${nextAvailDate.toLocaleDateString()}`,
        };
      }
    }
  }

  // 4. BOOKOUT CHECK (Column P)
  // Text format: "2024-01-01 to 2024-01-05"
  if (actor.bookouts) {
    const ranges = String(actor.bookouts).split(",");

    for (let range of ranges) {
      const parts = range.trim().split(" to ");

      if (parts.length === 2) {
        const start = new Date(parts[0]);
        const end = new Date(parts[1]);

        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);

          // If Project Start lands INSIDE the booked range
          if (pDate >= start && pDate <= end) {
            return {
              status: "unavailable",
              reason: `Booked out (${parts[0]} - ${parts[1]})`,
            };
          }
        }
      }
    }
  }

  // If we get here, they are free
  return { status: "available", reason: "Open" };
}
