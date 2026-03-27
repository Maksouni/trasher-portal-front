export const FRACTION_COLORS: Record<string, string> = {
  "ПЭТ (прозрачный)": "#007BFF", // Ярко-синий
  "ПЭТ (прозрачн.)": "#007BFF", // legacy API
  "ПЭТ (цвет)": "#339CFF", // Светло-синий
  "ПЭТ (цвет.)": "#339CFF", // legacy API
  "Пластиковый пакет": "#0056b3", // Тёмно-синий
  Стекло: "#20C997", // Бирюзовый
  Картон: "#FFD600", // Жёлтый
  Жесть: "#6C757D", // Серый
  "ПЭТ химический": "#B39DDB", // Пастельно-фиолетовый
  "Алюминиевая банка": "#a8abad", // Пастельно-фиолетовый
};

/** Единый ключ для сопоставления с бэком (пробелы, NBSP, NFC). */
export function normalizeCategoryKey(name?: string | null): string {
  if (name == null || name === "") return "";
  return name
    .replace(/\u00A0/g, " ")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .normalize("NFC");
}

const COLORS_BY_NORMALIZED_KEY: Record<string, string> = (() => {
  const m: Record<string, string> = {};
  for (const [k, v] of Object.entries(FRACTION_COLORS)) {
    m[normalizeCategoryKey(k)] = v;
  }
  return m;
})();

export function getFractionColor(
  name?: string | null,
  fallback = "#999",
): string {
  const key = normalizeCategoryKey(name);
  if (!key) return fallback;
  return COLORS_BY_NORMALIZED_KEY[key] ?? fallback;
}
