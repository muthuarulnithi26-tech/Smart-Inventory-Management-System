import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  Snackbar,
  Alert,
} from "@mui/material";

/**
 * Global success/error/info notification system.
 *
 * Usage:
 *   const notify = useNotify();
 *   notify.success("Warehouse created");
 *   notify.error("Could not delete product");
 *
 * Wrap the app once (see main.jsx):
 *   <NotificationProvider><App /></NotificationProvider>
 */

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [state, setState] = useState({
    open: false,
    message: "",
    severity: "success", // success | error | warning | info
  });

  const show = useCallback(
    (message, severity = "success") => {
      setState({
        open: true,
        message,
        severity,
      });
    },
    []
  );

  const api = useMemo(
    () => ({
      success: (message) => show(message, "success"),

      error: (message) => show(message, "error"),

      warning: (message) => show(message, "warning"),

      info: (message) => show(message, "info"),

      // Convenience for catch blocks:
      // notify.fromError(err, "Failed to save")
      fromError: (
        err,
        fallback = "Something went wrong"
      ) => {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          fallback;

        show(message, "error");
      },
    }),
    [show]
  );

  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;

    setState((s) => ({
      ...s,
      open: false,
    }));
  };

  return (
    <NotificationContext.Provider value={api}>
      {children}

      <Snackbar
        open={state.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Alert
          onClose={handleClose}
          severity={state.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {state.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
}

export function useNotify() {
  const ctx = useContext(NotificationContext);

  if (!ctx) {
    throw new Error(
      "useNotify() must be used inside <NotificationProvider>"
    );
  }

  return ctx;
}
