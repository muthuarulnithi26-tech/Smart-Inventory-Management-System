import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import Inventory2Icon from "@mui/icons-material/Inventory2";

import { useLocation, useNavigate } from "react-router-dom";

export default function StaffSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    {
      label: "Dashboard",
      path: "/staff",
      icon: <DashboardIcon />,
    },
    {
      label: "Customers",
      path: "/staff/customers",
      icon: <PeopleIcon />,
    },
    {
      label: "Products",
      path: "/staff/products",
      icon: <InventoryIcon />,
    },
    {
      label: "Create Order",
      path: "/staff/orders/create",
      icon: <AddShoppingCartIcon />,
    },
    {
      label: "Orders",
      path: "/staff/orders",
      icon: <ReceiptLongIcon />,
    },
    {
      label: "Stock",
      path: "/staff/stock",
      icon: <WarehouseIcon />,
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
          <Inventory2Icon
            sx={{
              color: "#fff",
              fontSize: 28,
            }}
          />
        </Box>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            lineHeight: 1.2,
          }}
        >
          Smart Inventory
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: "#94a3b8",
            mt: 0.5,
          }}
        >
          Staff Portal
        </Typography>
      </Box>

      <Divider
        sx={{
          borderColor: "rgba(255,255,255,0.08)",
        }}
      />

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
          DAILY OPERATIONS
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

                  bgcolor: active
                    ? "#2563eb"
                    : "transparent",

                  color: active
                    ? "#ffffff"
                    : "#cbd5e1",

                  boxShadow: active
                    ? "0 4px 12px rgba(37,99,235,0.35)"
                    : "none",

                  transition: "all .2s ease",

                  "&:hover": {
                    bgcolor: active
                      ? "#2563eb"
                      : "#1e293b",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 42,
                    color: active
                      ? "#ffffff"
                      : "#94a3b8",
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: active ? 700 : 500,
                    fontSize: "0.95rem",
                  }}
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
        <Typography
          variant="body2"
          sx={{
            color: "#94a3b8",
            fontWeight: 600,
          }}
        >
          Operations Staff
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: "#64748b",
          }}
        >
          Smart Inventory v1.0
        </Typography>
      </Box>
    </Box>
  );
}