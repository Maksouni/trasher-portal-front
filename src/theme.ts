import { ruRU } from "@mui/x-data-grid/locales";

import { createTheme } from "@mui/material/styles";

export function getTheme(mode: "light" | "dark") {
  return createTheme(
    {
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            "*": {
              transition:
                "background-color 0.2s ease-in-out, background 0.2s ease-in-out, box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out, opacity 0.2s ease-in-out, backdrop-filter 0.2s ease-in-out",
            },
            "svg, svg *": {
              transition: "none !important",
            },
          },
        },
      },
      typography: {
        fontFamily: [
          "Inter",
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ].join(","),
        button: {
          textTransform: "none",
        },
      },
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
    ruRU,
  );
}
