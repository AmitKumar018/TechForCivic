import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#ff7043" },
    background: { default: "#f4f6f8" },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "Inter, Roboto, sans-serif",
  },
});
