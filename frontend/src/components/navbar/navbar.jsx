import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";

import Inventory2Icon from "@mui/icons-material/Inventory2";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMe } from "../../api/auth.api";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const data = await getMe();
      setUser(data);
    } catch (err) {
      console.log(err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const getPageTitle = () => {
    const path = location.pathname;

    if (path.includes("dashboard")) return "Dashboard";
    if (path.includes("warehouses")) return "Warehouse Management";
    if (path.includes("managers")) return "Manager Management";
    if (path.includes("staff")) return "Staff Management";
    if (path.includes("products")) return "Product Management";
    if (path.includes("orders")) return "Order Management";
    if (path.includes("shipments")) return "Shipment Tracking";
    if (path.includes("reports")) return "Reports";
    if (path.includes("customers")) return "Customer Management";
    if (path.includes("stock")) return "Warehouse Stock";

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
      }}
    >
      <Toolbar sx={{ minHeight: 72, px: 3 }}>

        {/* LEFT */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Inventory2Icon sx={{ color: "#2563eb", fontSize: 30 }} />

          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {getPageTitle()}
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* RIGHT */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

          {loading ? (
            <CircularProgress size={20} />
          ) : (
            <Typography fontWeight={700}>
              {user?.name}
            </Typography>
          )}

          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
          >
            Logout
          </Button>

        </Box>
      </Toolbar>
    </AppBar>
  );
}

