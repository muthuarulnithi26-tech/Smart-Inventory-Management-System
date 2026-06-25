import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Chip,
} from "@mui/material";

import LogoutIcon from "@mui/icons-material/Logout";
import Inventory2Icon from "@mui/icons-material/Inventory2";

import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const getPageTitle = () => {
    const path = location.pathname;

    if (path.includes("dashboard")) return "Dashboard";

    if (path.includes("warehouses"))
      return "Warehouse Management";

    if (path.includes("managers"))
      return "Manager Management";

    if (path.includes("staff"))
      return "Staff Management";

    if (path.includes("products"))
      return "Product Management";

    if (path.includes("orders"))
      return "Order Management";

    if (path.includes("shipments"))
      return "Shipment Tracking";

    if (path.includes("reports"))
      return "Reports";

    if (path.includes("customers"))
      return "Customer Management";

    if (path.includes("stock"))
      return "Warehouse Stock";

    return "Smart Inventory Management";
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "#ffffff",
        color: "#0f172a",
        borderBottom: "1px solid #e2e8f0",
        backdropFilter: "blur(8px)",
      }}
    >
      <Toolbar
        sx={{
          minHeight: 72,
          px: 3,
        }}
      >
        {/* Left Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Inventory2Icon
            sx={{
              color: "#2563eb",
              fontSize: 30,
            }}
          />

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            {getPageTitle()}
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Right Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Chip
            label={role ? role.toUpperCase() : "USER"}
            color="primary"
            sx={{
              fontWeight: 700,
            }}
          />

          <Button
            variant="outlined"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              fontWeight: 600,
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
