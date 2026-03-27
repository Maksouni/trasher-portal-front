function formatWeight(weight: number): string {
  const w = Math.round(Number(weight) || 0);
  if (w < 1_000) {
    return `${w} г`;
  }
  if (w < 1_000_000) {
    return `${Math.round(w / 1_000)} кг`;
  }
  return `${Math.round(w / 1_000_000)} т`;
}
export default formatWeight;
