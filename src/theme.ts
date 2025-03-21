import { ruRU } from "@mui/x-data-grid/locales";

export const themeColors = {
  primary: "#3f51b5",
  secondary: "#dc004e",
  tertiary: "#03dac6",
};

import { createTheme } from "@mui/material/styles";

export function getTheme(mode: "light" | "dark") {
  return createTheme(
    {
      palette: {
        mode: mode,
        background: {
          default: mode === "dark" ? "#121212" : "#fafafa", // Цвет фона для страницы
          paper: mode === "dark" ? "#1d1d1d" : "#ffffff", // Цвет фона для карточек, панелей и т.д.
        },
        text: {
          primary: mode === "dark" ? "#ffffff" : "#000000", // Цвет основного текста
          secondary: mode === "dark" ? "#b0b0b0" : "#555555", // Цвет вторичного текста
        },
        primary: {
          main: mode === "dark" ? "#bb86fc" : "#1976d2", // Основной цвет для кнопок и акцентов
        },
        secondary: {
          main: mode === "dark" ? "#03dac6" : "#dc004e", // Вторичный цвет для кнопок
        },
        success: {
          main: mode === "dark" ? "#4caf50" : "#388e3c", // Цвет для успешных действий
        },
      },
    },
    ruRU
  );
}
