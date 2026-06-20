const INDIA_TIME_ZONE = "Asia/Kolkata";
const INDIA_UTC_OFFSET_MS = 5.5 * 60 * 60 * 1000;

function getIndiaHour(date: Date) {
  try {
    const hourPart = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hourCycle: "h23",
      timeZone: INDIA_TIME_ZONE,
    })
      .formatToParts(date)
      .find((part) => part.type === "hour");

    const hour = Number(hourPart?.value);
    if (Number.isInteger(hour) && hour >= 0 && hour <= 23) {
      return hour;
    }
  } catch {
    // Fall through to the fixed IST offset. India does not use daylight saving.
  }

  return new Date(date.getTime() + INDIA_UTC_OFFSET_MS).getUTCHours();
}

export function getCravingDeskLabel(date = new Date()) {
  const hour = getIndiaHour(date);

  if (hour >= 5 && hour < 12) {
    return "MORNING CRAVING DESK";
  }

  if (hour >= 12 && hour < 17) {
    return "AFTERNOON CRAVING DESK";
  }

  if (hour >= 17 && hour < 21) {
    return "EVENING CRAVING DESK";
  }

  return "LATE-NIGHT CRAVING DESK";
}
