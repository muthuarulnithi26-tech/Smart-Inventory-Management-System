import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2563eb",
    },
    secondary: {
      main: "#0f172a",
    },
    background: {
      default: "#f4f6f8",
    },
  },

  typography: {
    fontFamily: "Inter, Arial, sans-serif",
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 700,
    },
  },

  shape: {
    borderRadius: 12,
  },
});

export default theme;
