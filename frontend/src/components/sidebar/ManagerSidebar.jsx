import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AssessmentIcon from "@mui/icons-material/Assessment";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AddBoxIcon from "@mui/icons-material/AddBox";

import { useNavigate, useLocation } from "react-router-dom";

export default function ManagerSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    {
      label: "Dashboard",
      path: "/manager/dashboard",
      icon: <DashboardIcon />,
    },
    {
      label: "Order Approval",
      path: "/manager/orders-approval",
      icon: <ReceiptLongIcon />,
    },
    {
      label: "Staff",
      path: "/manager/staff",
      icon: <PersonAddIcon />,
    },
    {
      label: "Products",
      path: "/manager/products",
      icon: <InventoryIcon />,
    },
    // {
    //   label: "Create Shipment",
    //   path: "/manager/create-shipment",
    //   icon: <AddBoxIcon />,
    // },
    {
      label: "Shipments",
      path: "/manager/shipments",
      icon: <LocalShippingIcon />,
    },
    {
      label: "Reports",
      path: "/manager/reports",
      icon: <AssessmentIcon />,
    },
  ];

  return (
    <Box
      sx={{
        width: 280,
        minHeight: "100vh",
        bgcolor: "#0f172a",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* HEADER */}
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: 3,
            bgcolor: "#2563eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <Inventory2Icon sx={{ color: "#fff", fontSize: 28 }} />
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Smart Inventory
        </Typography>

        <Typography variant="body2" sx={{ color: "#94a3b8", mt: 0.5 }}>
          Manager Portal
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

      {/* MENU */}
      <Box sx={{ p: 2 }}>
        <Typography
          variant="caption"
          sx={{
            color: "#64748b",
            fontWeight: 700,
            letterSpacing: 1,
            px: 1,
          }}
        >
          WAREHOUSE OPERATIONS
        </Typography>

        <List sx={{ mt: 1 }}>
          {menu.map((item) => {
            const active =
              location.pathname === item.path ||
              location.pathname.startsWith(item.path + "/");

            return (
              <ListItemButton
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  mb: 1,
                  borderRadius: 3,
                  minHeight: 52,
                  bgcolor: active ? "#2563eb" : "transparent",
                  color: active ? "#ffffff" : "#cbd5e1",
                  boxShadow: active
                    ? "0 4px 12px rgba(37,99,235,0.35)"
                    : "none",
                  transition: "all .2s ease",
                  "&:hover": {
                    bgcolor: active ? "#2563eb" : "#1e293b",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 42,
                    color: active ? "#ffffff" : "#94a3b8",
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        fontWeight: active ? 700 : 500,
                        fontSize: "0.95rem",
                      }}
                    >
                      {item.label}
                    </Typography>
                  }
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      {/* FOOTER */}
      <Box
        sx={{
          p: 3,
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Typography variant="body2" sx={{ color: "#94a3b8", fontWeight: 600 }}>
          Warehouse Manager
        </Typography>

        <Typography variant="caption" sx={{ color: "#64748b" }}>
          Smart Inventory v1.0
        </Typography>
      </Box>
    </Box>
  );
}
