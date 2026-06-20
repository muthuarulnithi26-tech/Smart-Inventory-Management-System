import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import { useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");

  const menu = [
    {
      label: "Dashboard",
      path: "/",
      icon: <DashboardIcon />,
      roles: ["admin", "manager", "staff"]
    },
    {
      label: "Stock",
      path: "/stock",
      icon: <InventoryIcon />,
      roles: ["admin", "manager", "staff"]
    },
    {
      label: "Shipments",
      path: "/shipments",
      icon: <LocalShippingIcon />,
      roles: ["admin", "manager"]
    },
    {
      label: "Reports",
      path: "/reports",
      icon: <AssessmentIcon />,
      roles: ["admin"]
    },
    {
      label: "Admin",
      path: "/admin",
      icon: <AdminPanelSettingsIcon />,
      roles: ["admin"]
    }
  ];

  return (
    <Box
      sx={{
        width: 260,
        height: "100vh",
        bgcolor: "#0f172a",
        color: "white",
        p: 2
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        ERP SYSTEM
      </Typography>

      <List>
        {menu
          .filter((item) => item.roles.includes(role))
          .map((item) => (
            <ListItemButton
              key={item.path}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 2,
                mb: 1,
                backgroundColor:
                  location.pathname === item.path ? "#1d4ed8" : "transparent",

                "&:hover": {
                  backgroundColor: "#1e293b"
                }
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                {item.icon}
              </ListItemIcon>

              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
      </List>
    </Box>
  );
}
