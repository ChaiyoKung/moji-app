export function formatBaht(value: number): string {
  return value.toLocaleString("th-TH");
}

export function formatBahtCompact(value: number): string {
  if (value >= 1_000_000) return `${+(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${+(value / 1_000).toFixed(1)}k`;
  return String(value);
}
