import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";

export default function SessionExpiredDialog({ open }) {
  const handleLogin = () => {
    window.location.href = "/login";
  };

  return (
    <Dialog
      open={open}
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
// import { useSession } from "../context/SessionContext";

// export default function SessionExpiredDialog() {
//   const { sessionExpired } = useSession();

//   return (
//     <Dialog open={sessionExpired}></Dialog>