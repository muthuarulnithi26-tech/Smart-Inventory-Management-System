import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

import AdminSidebar from "../components/sidebar/AdminSidebar";
import Navbar from "../components/navbar/Navbar";

export default function AdminLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#f8fafc",
      }}
    >
      <AdminSidebar />

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <Navbar />

        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            width: "100%",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
