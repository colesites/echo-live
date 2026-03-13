const MINUTES_IN_HOUR = 60;
const SECONDS_IN_MINUTE = 60;
const MILLISECONDS_IN_MINUTE = 60000;

export function formatShortDate(timestamp: number) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(timestamp));
}

export function formatShortDateTime(timestamp: number) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export function formatDurationMinutes(minutes: number) {
  return `${minutes} min`;
}

export function formatDurationSeconds(seconds: number) {
  const minutes = Math.round(seconds / SECONDS_IN_MINUTE);
  if (minutes < MINUTES_IN_HOUR) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / MINUTES_IN_HOUR);
  const remainingMinutes = minutes % MINUTES_IN_HOUR;
  return `${hours}h ${remainingMinutes}m`;
}

export function formatLiveUptime(startTimestamp: number, nowTimestamp: number) {
  const diffMinutes = Math.max(
    0,
    Math.round((nowTimestamp - startTimestamp) / MILLISECONDS_IN_MINUTE),
  );
  return `Live · ${diffMinutes}m`;
}
