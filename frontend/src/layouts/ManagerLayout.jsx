import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

import AppSidebar, { SIDEBAR_WIDTH } from "../components/sidebar/AppSidebar";
import Navbar from "../components/navbar/Navbar";

export default function ManagerLayout() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100%", bgcolor: "#f8fafc" }}>
      <AppSidebar role="manager" />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar />

        <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3 }, width: "100%", boxSizing: "border-box" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
