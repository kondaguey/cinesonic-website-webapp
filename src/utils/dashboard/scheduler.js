export const checkSchedule = (actorPrivateData, projectStartDate) => {
  if (!actorPrivateData) return { status: "NEUTRAL", reason: "Unassigned" };
  if (!projectStartDate) return { status: "UNKNOWN", reason: "No Date" };

  const pDate = new Date(projectStartDate);
  if (isNaN(pDate.getTime()))
    return { status: "UNKNOWN", reason: "Invalid Date" };
  pDate.setHours(0, 0, 0, 0); // Normalize time to midnight

  // 1. STATUS CHECK
  const status = (
    actorPrivateData.availability_status || "Available"
  ).toLowerCase();
  if (
    status.includes("hiatus") ||
    status.includes("inactive") ||
    status.includes("booked")
  ) {
    return { status: "CONFLICT", reason: status.toUpperCase() };
  }

  // 2. NEXT AVAILABLE DATE CHECK
  if (actorPrivateData.next_available_date) {
    const nextAvail = new Date(actorPrivateData.next_available_date);
    if (!isNaN(nextAvail.getTime())) {
      nextAvail.setHours(0, 0, 0, 0);
      if (pDate < nextAvail) {
        return {
          status: "CONFLICT",
          reason: `Busy until ${nextAvail.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}`,
        };
      }
    }
  }

  // 3. BOOKOUTS CHECK (JSONB Parsing)
  // Expects JSONB array: ["YYYY-MM-DD to YYYY-MM-DD", ...] OR objects
  const bookouts = actorPrivateData.bookouts || [];

  if (Array.isArray(bookouts)) {
    for (let entry of bookouts) {
      let start, end;

      // Handle String Format: "2023-01-01 to 2023-01-05"
      if (typeof entry === "string") {
        const parts = entry.split(/ to | - /i);
        if (parts.length === 2) {
          start = new Date(parts[0]);
          end = new Date(parts[1]);
        }
      }
      // Handle Object Format: { start: "...", end: "..." }
      else if (typeof entry === "object" && entry.start && entry.end) {
        start = new Date(entry.start);
        end = new Date(entry.end);
      }

      if (start && end && !isNaN(start.getTime()) && !isNaN(end.getTime())) {
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999); // End of day

        // Conflict Logic: Project Start lands inside a Bookout Range
        if (pDate >= start && pDate <= end) {
          const cleanStart = start.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          });
          const cleanEnd = end.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          });
          return {
            status: "CONFLICT",
            reason: `Booked (${cleanStart} - ${cleanEnd})`,
          };
        }
      }
    }
  }

  return { status: "CLEAR", reason: "OPEN" };
};
