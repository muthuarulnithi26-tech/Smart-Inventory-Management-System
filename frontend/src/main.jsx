import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import App from "./App";
import "./index.css";
import theme from "./theme/theme";
import { SessionProvider } from "./context/SessionContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ConfirmProvider } from "./context/ConfirmContext";
import { SidebarProvider } from "./context/SidebarContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SessionProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NotificationProvider>
          <ConfirmProvider>
            <SidebarProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </SidebarProvider>
          </ConfirmProvider>
        </NotificationProvider>
      </ThemeProvider>
    </SessionProvider>
  </StrictMode>
);
