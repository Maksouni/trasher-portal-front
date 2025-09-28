function formatWeight(weight: number): string {
  if (weight < 1_000) {
    return `${weight} г`;
  } else if (weight < 1_000_000) {
    return `${(weight / 1_000).toFixed(2)} кг`;
  } else {
    return `${(weight / 1_000_000).toFixed(2)} т`;
  }
}
export default formatWeight;
