import { AppBar, Toolbar, Typography, Button } from "@mui/material";

export default function Navbar() {
  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>

        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Warehouse Management System
        </Typography>

        <Button color="inherit"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          Logout
        </Button>

      </Toolbar>
    </AppBar>
  );
}
