import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

import StaffSidebar from "../components/sidebar/StaffSidebar";
import Navbar from "../components/navbar/Navbar";

export default function StaffLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#f1f5f9",
      }}
    >
      {/* Sidebar */}
      <StaffSidebar />

      {/* Main Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        {/* Top Navbar */}
        <Navbar />

        {/* Page Content */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            p: { xs: 2, md: 3 },
            background:
              "linear-gradient(to bottom, #f8fafc 0%, #eef2f7 100%)",
          }}
        >
          <Box
            sx={{
              minHeight: "100%",
              borderRadius: 4,
              bgcolor: "#ffffff",
              p: { xs: 2, md: 3 },
              boxShadow: "0 4px 20px rgba(15,23,42,0.05)",
              border: "1px solid #e2e8f0",
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
