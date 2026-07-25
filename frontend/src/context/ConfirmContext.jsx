import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

/**
 * Global confirmation-dialog system (replaces window.confirm everywhere).
 *
 * Usage:
 *   const confirm = useConfirm();
 *
 *   const handleDelete = async () => {
 *     const ok = await confirm({
 *       title: "Delete warehouse?",
 *       message: "This action cannot be undone.",
 *       confirmText: "Delete",
 *       danger: true,
 *     });
 *     if (!ok) return;
 *     await deleteWarehouse(id);
 *   };
 */

const ConfirmContext = createContext(null);

const DEFAULT_OPTIONS = {
  title: "Are you sure?",
  message: "This action cannot be undone.",
  confirmText: "Confirm",
  cancelText: "Cancel",
  danger: false,
};

export function ConfirmProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [loading, setLoading] = useState(false);
  const resolveRef = useRef(null);

  const confirm = useCallback((opts = {}) => {
    setOptions({ ...DEFAULT_OPTIONS, ...opts });
    setOpen(true);
    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const close = (result) => {
    setOpen(false);
    setLoading(false);
    resolveRef.current?.(result);
    resolveRef.current = null;
  };

  // Supports async onConfirm work (e.g. awaiting the delete API call)
  // while keeping the dialog open with a disabled/loading confirm button.
  const handleConfirmClick = async () => {
    if (options.onConfirm) {
      try {
        setLoading(true);
        await options.onConfirm();
        close(true);
      } catch (e) {
        setLoading(false);
        // Leave dialog open so the caller can show an error and retry.
      }
    } else {
      close(true);
    }
  };

  const api = useMemo(() => confirm, [confirm]);

  return (
    <ConfirmContext.Provider value={api}>
      {children}

      <Dialog
        open={open}
        onClose={() => (!loading ? close(false) : null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {options.danger && (
            <WarningAmberIcon color="error" fontSize="small" />
          )}
          {options.title}
        </DialogTitle>

        <DialogContent>
          <DialogContentText>{options.message}</DialogContentText>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => close(false)} disabled={loading}>
            {options.cancelText}
          </Button>
          <Button
            onClick={handleConfirmClick}
            variant="contained"
            color={options.danger ? "error" : "primary"}
            disabled={loading}
            autoFocus
          >
            {loading ? "Please wait…" : options.confirmText}
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error("useConfirm() must be used inside <ConfirmProvider>");
  }
  return ctx;
}
