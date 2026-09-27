export function money(value: number, compact = false) {
  if (compact) {
    if (value >= 1000000) return "$" + (value / 1000000).toFixed(1) + "M";
    if (value >= 1000) return "$" + Math.round(value / 1000) + "K";
  }
  return "$" + value.toLocaleString("en-US");
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
