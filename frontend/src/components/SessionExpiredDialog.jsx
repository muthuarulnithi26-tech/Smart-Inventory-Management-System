import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";
import { useSession } from "../context/SessionContext";

export default function SessionExpiredDialog() {
  const { sessionExpired } = useSession();

  const handleLogin = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <Dialog
      open={!!sessionExpired}
      disableEscapeKeyDown
    >
      <DialogTitle>
        Session Expired
      </DialogTitle>

      <DialogContent>
        <Typography>
          Your login session has expired.
        </Typography>

        <Typography sx={{ mt: 1 }}>
          Please login again to continue using the system.
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          onClick={handleLogin}
        >
          Login Again
        </Button>
      </DialogActions>
    </Dialog>
  );
}