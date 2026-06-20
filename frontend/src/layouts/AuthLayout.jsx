import { Box, Paper } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f6f8"
      }}
    >
      <Paper sx={{ p: 4, width: 380, borderRadius: 3 }}>
        <Outlet />
      </Paper>
    </Box>
  );
}
