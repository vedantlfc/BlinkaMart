export function getCravingDeskLabel(date = new Date()) {
  const hour = date.getHours();

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
